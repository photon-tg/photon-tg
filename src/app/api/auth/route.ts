import * as crypto from "crypto";
import { z } from "zod";

const AuthenticationData = z.object({
  dataCheckString: z.string().trim().min(1),
});

type AuthenticationDataBody = z.infer<typeof AuthenticationData>;

export async function POST(request: Request) {
  const body: AuthenticationDataBody = await request.json();

  const { data, error, success } = AuthenticationData.safeParse(body);

  if (!success) {
    return new Response(JSON.stringify({
      message: 'Error occurred while validating'
    }), {
      status: 400,
    });
  }

  try {
    const dataCheckString = body.dataCheckString;
    const decodedDataCheckString = decodeURIComponent(dataCheckString);

    const secret = crypto.createHmac("sha256", "WebAppData").update(process.env.TELEGRAM_BOT_TOKEN!);
    console.log(process.env.TELEGRAM_BOT_TOKEN, 'tg token')
    const dataCheckArr = decodedDataCheckString.split('&');
    const sortedDataCheckArr = dataCheckArr.sort((a, b) => a.localeCompare(b));

    const dataCheckURLSearchParams = new URLSearchParams(decodedDataCheckString);
    const hash = dataCheckURLSearchParams.get('hash');

    const dataCheck = sortedDataCheckArr.join('\n');

    const _hash = crypto
      .createHmac("sha256", secret.digest())
      .update(dataCheck)
      .digest("hex");

    console.log(_hash, hash, 'hash', decodedDataCheckString, 'decoded');
    if (_hash === hash) {
      // data is from Telegram
      const userData: WebAppUser = JSON.parse(dataCheckURLSearchParams.get('user') as string);
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
