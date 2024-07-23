# # Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# Sending a plain text fragment
Content-Type: text/plain
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
`This is a fragment!`

# 1. We expect to get back an HTTP 201
HTTP/1.1 201

[Captures]
url: header "Location"

# 2. convert to text/markdown (unsupported)
GET {{url}}.md
[BasicAuth]
user1@email.com:password1

# 415 fail response, unsupported conversion
HTTP/1.1 415

# Convert to text/plain (supported)
GET {{url}}.txt
[BasicAuth]
user1@email.com:password1

# 200 success response
HTTP/1.1 200