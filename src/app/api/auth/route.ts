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
    const other = verifyTelegramWebAppData(dataCheckString);
    console.log(other, 'other')
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

const verifyTelegramWebAppData = (telegramInitData: string) => {
  // The data is a query string, which is composed of a series of field-value pairs.
  const encoded = decodeURIComponent(telegramInitData);

  // HMAC-SHA-256 signature of the bot's token with the constant string WebAppData used as a key.
  const secret = crypto.createHmac("sha256", "WebAppData").update(process.env.TELEGRAM_BOT_TOKEN!);

  // Data-check-string is a chain of all received fields'.
  const arr = encoded.split("&");
  const hashIndex = arr.findIndex((str) => str.startsWith("hash="));
  const hash = arr.splice(hashIndex)[0].split("=")[1];
  // Sorted alphabetically
  arr.sort((a, b) => a.localeCompare(b));
  // In the format key=<value> with a line feed character ('\n', 0x0A) used as separator
  // e.g., 'auth_date=<auth_date>\nquery_id=<query_id>\nuser=<user>
  const dataCheckString = arr.join("\n");

  // The hexadecimal representation of the HMAC-SHA-256 signature of the data-check-string with the secret key
  const _hash = crypto
    .createHmac("sha256", secret.digest())
    .update(dataCheckString)
    .digest("hex");

  // If hash is equal, the data may be used on your server.
  // Complex data types are represented as JSON-serialized objects.
  return _hash === hash;
};
