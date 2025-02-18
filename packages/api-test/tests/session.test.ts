import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.HTTP_PORT || 5000;
const base_url = `http://localhost:${port}/api/v1`;

describe("Create Session for Creator only", () => {

    test('Successfully session created with a valid title and description and respond with a sessionId', async () => {
        const title = "Full Stack cohort class #1" + Math.random();
        const description = "Optional description" + Math.random();

        const reqBody = {
            "email": "shivam@gmail.com",
            "password": "Ab@12345"
        };
        
        const signinResponse = await axios.post(`${base_url}/signin`, reqBody);
        console.log(signinResponse);
        
        const cookies=signinResponse.headers['set-cookie'];
        const jwtCookie=cookies?.find((cookie)=>cookie.startsWith('jwt'));
        console.log(jwtCookie);

        const response = await axios.post(base_url + '/session', {
            title,
            description
        }, {
            headers: signinResponse.headers
        });

        expect(response.status).toBe(200);
        expect(response.data.sessionId).toBeDefined();
    });

    test('Bad request missing title or invalid data', async () => {
        try {
            const title = ""
            const description = ""
            const response = await axios.post(base_url + '/session', {
                title,
                description
            });
        } catch(error: any) {
            expect(error.response.status).toBe(400);
        }
    });

    test('Should return 401 if Unauthorized person detected', async () => {
        try {
            const title = "Full Stack cohort class #1" + Math.random();
            const description = "Optional description" + Math.random();
            const response = await axios.post(base_url + '/session', {
                title,
                description
            });
        } catch(error: any) {
            expect(error.response.status).toBe(401);
            expect(error.response.data.body).toHaveProperty('error');
        }
    });

    test('server error should return status 500', async () => {
        const title = "Full Stack cohort class #1" + Math.random();
        const description = "Optional description" + Math.random();
    
        // Mock server error
        jest.spyOn(global, 'setTimeout').mockImplementation(() => {
          throw new Error('Internal server error');
        });
    
        try {
            const response = await axios.post(base_url + '/session', {
            title,
            description
            });
        } catch(error: any) {
            expect(error.response.status).toBe(500);
            expect(error.response.data.body).toHaveProperty('error');
            expect(error.response.data.body.error).toBe('Internal server error');
        }
    
        // Restore original implementation
        jest.restoreAllMocks();
    });

})