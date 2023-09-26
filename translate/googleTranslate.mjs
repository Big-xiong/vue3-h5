import GT from '@google-cloud/translate';
import clArgs from 'command-line-args';
import path from 'path';
import fs from 'fs';

let keyFile = '';
let translate = null;

export function getKeyJson(key) {
    if (!fs.existsSync(key)) {
        fs.writeFileSync(path.resolve('./key.json'), JSON.stringify({
            'type': 'service_account',
            'project_id': 'node-translate-1629804874280',
            'private_key_id': '0e7b1ed43e070bef9083de676255faf0b5e41d8d',
            'private_key': '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCh6xbTrUFuKuJu\nGHQyqODsruggKTuLPwJsu/p9JDX/Xg14sLxHVSurDPquPAdxb6huvmYWAGncLDZy\nKj+Upxw4S1p8oE/w3YtHvxAspwRs0Q2mKBPkPnPvGcozcwTZ40Sqa7LGbeAGcLnF\nLbfo/1l8RqshalxR3lIZJyMi3XuAzJhSW3m1mJ/aFQJHA/z/LThvvvJREXQ86bjC\nqpec30Hdd1pvsvhx5U/E1+t64l2lFI9h7kv56UlW/5y0zwNb3H8ouuslr/5td4RA\ntTklT03WYW4Igf6gCJzSwU8VOcCO/kw3nRzA9zM4UekUAdL9yRVMoIe88gaF8nQY\n0K1SY0FnAgMBAAECggEABblGcP/AMkStODoaEj5hCrM/vMwbiqRIEcLu+GSCzVh5\nGAnOjHD8BOU5D70Xs3bzsjJ91lirMh+UyLvDzDcm3e1f/f7TkWhFFHZL4pNm3YsV\nG4k+jSqqzrCpMq3MTDPmyTJBO0pGb8PYjubuVOJN7gEFHj6ULXqzItt80cf/JfVH\nJdgXQfx3KNMlySDT4Zwq3m7R+N8r2fbifWLuxa9e6zeMn+bp/wiaRMobiUwhQYp8\nx16iFlfhS+AEpoiNGTW5M5ffAW/KgYv45htL5jg9geVfmG/0PQ6BxjWQiUwulZ5g\nx45iz+KfICVqCx/xcj2GCMdvjj2rAX93IYWNaoJkXQKBgQDQ4osn3I0OvoQUQ6lK\nAQBgao8i7QFVS/ksAoiQIcJ0z5CoZTvkJnV9AjWHm1XYEVyW3oB0h889e4eGUMgC\nW2u7zIVyk+roFdX4sXN6tSDA9PFT3A4NhHNCuZii1KtU14gL2W9YPSxUL7laivz8\nrhaIrjE6NXSAWu3cZY56OOs2OwKBgQDGcJgS8QsszluLiVB83WUXeHEJ9TPaymdS\nio8fEjVMgjgWLuS1YRWTdzJ+MbulHhWeeFVWRX7lqWYmcOO9PDKSQyZo4JSM0YGP\nkroim0Mfb3ffGRwNG5blQ0F/ZH1T/eZpQsoFXyKeovZ8EOeZ/XcXSZ3i/F2d86uw\nxknz4rEyxQKBgA9HoxpFXeQoN40r7eRF8nsbEGFjqOdOaWm4vbidX5Yf4NsQnLLx\nxUJhuPy0djEaBAXdPNRJYvWCZcWDfz385gKU0WYyP8q+XiqVAHeHbF/xCv4xaK3A\ndJX68ZlnqSjJo2AKhcSUpPt7ijl/VUY+jdNtupghdOY2wJOQsj1qkHolAoGAOOsm\n05gMKofuPjHewlIGoxrK4Z5Rh1ozFLvlnXXtj8pyJ/q/Yz87nxa7hvLg7dWZQeEm\nKR657UoPoMsUp7zSjJ1yMPbp5RJa5UGi3jZGpIemjHl5UFEvkQcfjFjYkfTr2Blu\nNOg61+HKbX+zzrmjJSzaercEaz/vaT8XCztktDkCgYEAmRKNcHoW2GTTHgk5YgTw\nYvviLbltffVl9OJDqfTCZfVucvLJSC/KaFKryRLefRHh+7aUhnBf/2qYZynMxpS1\nqGRRdG/jDfneC9c5jJuefBj0HhtvnmL2LjWQb+iJa+mOZwtiFBrAwGTmbmEdPwIk\nnn+FwCxMpGDsH81z5bxhWYk=\n-----END PRIVATE KEY-----\n',
            'client_email': 'starting-account-wy342tf0tjj5@node-translate-1629804874280.iam.gserviceaccount.com',
            'client_id': '109414804216060638585',
            'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
            'token_uri': 'https://oauth2.googleapis.com/token',
            'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
            'client_x509_cert_url': 'https://www.googleapis.com/robot/v1/metadata/x509/starting-account-wy342tf0tjj5%40node-translate-1629804874280.iam.gserviceaccount.com'
        }));
        keyFile = path.resolve('./key.json');
    } else {
        keyFile = path.resolve(key);
    }
    process.env.GOOGLE_APPLICATION_CREDENTIALS = keyFile;
    translate = new GT.v2.Translate({
        keyFile
    });
}

export async function translateText(text, target) {
    console.log(target, '翻译请求中....')
    let translations = await translate.translate(text, target);
    console.log(target, '请求成功', translations?.[0]?.split('\n').length ?? '')
    // translations = Array.isArray(translations) ? translations : [translations];
    // translations.forEach((translation, i) => {
    //     console.log(`${text[i]} => (${target}) ${translation}`);
    // });
    // console.log(`${text} => (${target}) ${translations?.[0]}`);
    return translations?.[0]
}

export const replaceAll = (find, replace, str) => {
    var find = find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    return str.replace(new RegExp(find, 'g'), replace);
};
