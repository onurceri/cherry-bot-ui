Endpoints

- POST /api/v1/auth/register
- POST /api/v1/auth/login
- Base URL: http://localhost:8000 (adjust per environment)
Request Schemas

- POST /api/v1/auth/register
  - Content-Type: application/json
  - Body:
    - email : string (email)
    - password : string
- POST /api/v1/auth/login
  - Content-Type: application/x-www-form-urlencoded
  - Fields:
    - username : string (email)
    - password : string
  - Note: No grant_type required; tests cover username/password only.
Response Schemas

- Envelope wrapper for all responses:
  - Envelope : { data: object, status: string }
- POST /api/v1/auth/register success
  - data : { id: string, email: string }
  - status : "success"
- POST /api/v1/auth/login success
  - data : { access_token: string, token_type: "bearer" }
  - status : "success"
- Error cases
  - register : 400 with JSON { detail: "Email already registered" }
  - login : 401 with JSON { detail: "Incorrect email or password" } and header WWW-Authenticate: Bearer
TypeScript Interfaces

- RegisterRequest : { email: string; password: string }
- RegisterResponse : { data: { id: string; email: string }; status: 'success' }
- LoginFormData : { username: string; password: string } // sent as form fields
- LoginResponse : { data: { access_token: string; token_type: 'bearer' }; status: 'success' }
- ErrorResponse : { detail: string }
Examples

- Register (fetch):
  - fetch('/api/v1/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
- Login (fetch with form):
  - const body = new URLSearchParams({ username: email, password }); fetch('/api/v1/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
- Axios Register:
  - axios.post('/api/v1/auth/register', { email, password })
- Axios Login (form):
  - axios.post('/api/v1/auth/login', new URLSearchParams({ username: email, password }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })