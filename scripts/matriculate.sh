#!/bin/bash
# Usage: ./matriculate.sh <applicant-email> <programme-slug> <cookie-jar-path>
set -e
EMAIL=$1
PROGRAMME=$2
JAR=$3

curl -s -c "$JAR" http://localhost:3000/api/auth/csrf -o /tmp/mm_csrf.json
CSRF=$(python3 -c "import json; print(json.load(open('/tmp/mm_csrf.json'))['csrfToken'])")
curl -s -b "$JAR" -c "$JAR" -X POST http://localhost:3000/api/auth/callback/credentials \
  --data-urlencode "email=$EMAIL" --data-urlencode "password=Passw0rd!" \
  --data-urlencode "csrfToken=$CSRF" --data-urlencode "json=true" -o /dev/null

curl -s -b "$JAR" -X POST http://localhost:3000/api/admissions/apply \
  -H "Content-Type: application/json" -d "{\"programmeSlug\":\"$PROGRAMME\"}" -o /tmp/mm_apply.json
APPID=$(python3 -c "import json; print(json.load(open('/tmp/mm_apply.json'))['id'])")

# Staff login + offer
curl -s http://localhost:3000/demo-mfa-code -o /tmp/mm_mfa.html
CODE=$(python3 -c "import re; print(re.search(r'font-mono text-5xl[^>]*>([0-9]{6})<', open('/tmp/mm_mfa.html').read()).group(1))")
curl -s -c /tmp/mm_staff.txt http://localhost:3000/api/auth/csrf -o /tmp/mm_csrf2.json
CSRF2=$(python3 -c "import json; print(json.load(open('/tmp/mm_csrf2.json'))['csrfToken'])")
curl -s -b /tmp/mm_staff.txt -c /tmp/mm_staff.txt -X POST http://localhost:3000/api/auth/callback/credentials \
  --data-urlencode "email=staff@mouau.edu.ng" --data-urlencode "password=Passw0rd!" \
  --data-urlencode "totpCode=$CODE" --data-urlencode "csrfToken=$CSRF2" --data-urlencode "json=true" -o /dev/null
curl -s -b /tmp/mm_staff.txt -X POST http://localhost:3000/api/admissions/decide \
  -H "Content-Type: application/json" -d "{\"applicationId\":\"$APPID\",\"decision\":\"offered\"}" -o /dev/null

curl -s -b "$JAR" -c "$JAR" -X POST http://localhost:3000/api/admissions/respond \
  -H "Content-Type: application/json" -d '{"response":"accepted"}' -o /tmp/mm_matric.json
curl -s -b "$JAR" http://localhost:3000/api/auth/csrf -o /tmp/mm_csrf3.json
CSRF3=$(python3 -c "import json; print(json.load(open('/tmp/mm_csrf3.json'))['csrfToken'])")
curl -s -b "$JAR" -c "$JAR" -X POST http://localhost:3000/api/auth/session \
  -H "Content-Type: application/json" -d "{\"csrfToken\":\"$CSRF3\",\"data\":{}}" -o /dev/null

python3 -c "import json; d=json.load(open('/tmp/mm_matric.json')); print(d['studentRecord']['matricNumber'])"
