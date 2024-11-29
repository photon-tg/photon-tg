import { TelegramAuth } from '@/utils/telegram-auth-verification';
import { createClient } from '@supabase/supabase-js';
import TonWeb from 'tonweb';
import { mnemonicToSeed } from 'tonweb-mnemonic';
const BN = TonWeb.utils.BN;

export const runtime = "edge"

const isMainnet = true;

const tonweb = isMainnet
	? new TonWeb(
			new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {
				apiKey: process.env.TON_MAINNET_API_KEY,
			}),
		)
	: new TonWeb(
			new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC', {
				apiKey: process.env.TON_TETSNET_API_KEY,
			}),
		);

const doWithdraw = async (
	withdrawalRequest: any,
	wallet: any,
	keyPair: any,
) => {
	const seqno = await wallet.methods.seqno().call(); // get the current wallet `seqno` from the network

	if (seqno !== withdrawalRequest.seqno) {
		throw new Error('seqno');
		return;
	}

	const balance = new BN(
		await tonweb.provider.getBalance(
			(await wallet.getAddress()).toString(true, true, true),
		),
	);

	if (withdrawalRequest.amount.gte(balance)) {
		console.log('there is not enough balance to process the withdrawal');
		throw new Error('Balance');
	}

	let toAddress = withdrawalRequest.toAddress;

	const info = await tonweb.provider.getAddressInfo(toAddress);
	if (info.state !== 'active') {
		toAddress = new TonWeb.utils.Address(toAddress).toString(true, true, false); // convert to non-bounce
	}

	const transfer = await wallet.methods.transfer({
		secretKey: keyPair.secretKey,
		toAddress: toAddress,
		amount: withdrawalRequest.amount,
		seqno: withdrawalRequest.seqno,
	});

	return transfer.send();
};

export async function POST(request: Request) {
	const body = await request.json();
	const { wallet_address, data_check_string } = body;

	try {
		const dataCheckString = data_check_string ?? '';
		const dataCheckStringDecoded = decodeURIComponent(dataCheckString);
		const tgAuthClient = new TelegramAuth(dataCheckStringDecoded);
		const isDataValid = tgAuthClient.verifyAuthString();

		if (!isDataValid) throw new Error('Invalid data');

		const userTgData = tgAuthClient.parseAuthString();

		const supabase = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.SUPABASE_SERVICE_ROLE_KEY!,
		);

		const { data: userData, error: userError } = await supabase
			.from('users')
			.select('id')
			.eq('telegram_id', userTgData.user.id)
			.limit(1)
			.single();

		if (userError && !userError) throw new Error('No user');

		const { data: userRewardsData, error: userRewardsError } = await supabase
			.from('battle_rewards')
			.select('amount')
			.eq('is_claimed', false)
			.eq('user_id', (userData as any).id);

		if (userRewardsError && !userRewardsData) throw new Error('No rewards');

		const fullAmount = (userRewardsData as any[])?.reduce((acc, curr) => {
			return (acc += curr?.amount);
		}, 0);

		if (fullAmount <= 0) {
			throw new Error('Empty amount');
		}

		const nanoAmount = TonWeb.utils.toNano(fullAmount.toString());

		const seed = await mnemonicToSeed(process.env.TON_WALLET_WORDS!.split('_'));
		const keyPair = TonWeb.utils.nacl.sign.keyPair.fromSeed(seed);

		const WalletClass = tonweb.wallet.all.v3R2;

		const wallet = new WalletClass(tonweb.provider, {
			publicKey: keyPair.publicKey,
		});

		const seqno = await wallet.methods.seqno().call();

		await doWithdraw(
			{
				amount: nanoAmount,
				toAddress: wallet_address,
				seqno,
			},
			wallet,
			keyPair,
		);

		return new Response('OK', {
			status: 200,
		});
	} catch (err) {
		console.log(err);
		return new Response('Error', {
			status: 500,
		});
	}
}
