import { TelegramAuth } from '@/utils/telegram-auth-verification';
import { z } from 'zod';

const AuthenticationData = z.object({
  dataCheckString: z.string().trim().min(1),
});

type AuthenticationDataBody = z.infer<typeof AuthenticationData>;

// Add caching or JWT tokens on top
// TODO: use ready-made lib https://github.com/Telegram-Mini-Apps/telegram-apps/tree/master/packages/init-data-node
export async function POST(request: Request) {
  const body: AuthenticationDataBody = await request.json();

  const { data, error, success } = AuthenticationData.safeParse(body);

  if (error) {
    return new Response(
      JSON.stringify({
        message: 'Error occurred while validating',
      }),
      {
        status: 400,
      },
    );
  }

  try {
    const dataCheckString = body.dataCheckString;
    const dataCheckStringDecoded = decodeURIComponent(dataCheckString);

    const tgAuthClient = new TelegramAuth(dataCheckStringDecoded);
    const isDataValid = tgAuthClient.verifyAuthString();

    if (!isDataValid) {
      return new Response(
        JSON.stringify({
          message: 'You are not allowed to use this app outside of telegram',
        }),
        { status: 403 },
      );
    }

    const userData = tgAuthClient.parseAuthString();
    console.log(userData, 'sd');
    return new Response(JSON.stringify(userData.metadata.user), {
      status: 200,
    });
  } catch (err) {
    console.error(err, 'error');
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
    });
  }
}