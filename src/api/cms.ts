import { createClient } from 'contentful';

const cms = createClient({
	space: 'jzbyhy5tq89d',
	environment: 'master', // defaults to 'master' if not set
	accessToken: '8a3zrVsUxzRmEK8UxW3QRJ8fQj4kptxM3n41VLL1338',
});

export default cms;
