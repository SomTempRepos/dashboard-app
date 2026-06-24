curl -X 'POST' \
  'http://127.0.0.1:8000/auth/register' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "test-five",
  "email": "test-five@example.in",
  "password": "strong-password"
}'
Response : {"id":"66b83540-ec58-42f6-b453-e9ab1510d4b7","name":"test-five","email":"test-five@example.in","user_code":"X1EVRE","team_ids":[],"created_at":"2026-06-23T04:29:35.991253"}
