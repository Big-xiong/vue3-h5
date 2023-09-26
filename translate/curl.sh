export GOOGLE_APPLICATION_CREDENTIALS="$3"

curl -s -X POST -H "Content-Type: application/json" \
    -H "Authorization: Bearer "$(gcloud auth application-default print-access-token) \
    --data "{
  'q': '$1',
  'source': '',
  'target': '$2',
  'format': 'text'
}" "https://translation.googleapis.com/language/translate/v2"


#echo $1;
#echo $2;
#echo($2)
