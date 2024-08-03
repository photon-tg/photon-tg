import * as crypto from "crypto";
import {z} from "zod";

const AuthenticationData = z.object({
  dataCheckString: z.string(),
});

type AuthenticationDataBody = z.infer<typeof AuthenticationData>;

export async function POST(request: Request) {
  const body: AuthenticationDataBody = await request.json();

  const { data, error, success } = AuthenticationData.safeParse(body);
  console.log(data, body, 'bd');
  if (!success) {
    console.log(error);
    return new Response(JSON.stringify({
      message: 'Error occurred while validating'
    }), {
      status: 400,
    });
  }

  try {
    const dataCheckString = body.dataCheckString;
    const decodedDataCheckString = decodeURIComponent(dataCheckString);
    const dataCheckMap = new URLSearchParams(decodedDataCheckString);
    const hash = dataCheckMap.get('hash');
    const secretKey = crypto.createHmac('sha256', process.env.TELEGRAM_BOT_TOKEN!).update('WebAppData').digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
    console.log(calculatedHash, hash, 'hash');
    if (calculatedHash === hash) {
      // data is from Telegram
      console.log('success');
      const userData: WebAppUser = JSON.parse(dataCheckMap.get('user') as string);
      const response= {
        telegramId: userData.id,
        firstName: userData.first_name,
        lastName: userData.last_name,
        language: userData.language_code,
      }
      return new Response(JSON.stringify(response), {
        status: 200,
      });
    }

    return new Response(JSON.stringify({ message: 'You are not allowed to use this app outside of telegram' }), { status: 403 });
  } catch (err) {
    console.error(err, 'error');
    return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
}
