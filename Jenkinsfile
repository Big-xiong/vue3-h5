pipeline{
  agent {
    label 'slave-acebet'
  }
  parameters {
    string(name: 'MERCHANT_NO', defaultValue: '', description: '商户号')
    booleanParam(name: 'IS_FULL', defaultValue: false, description: '全量更新(使用yml配置)')
    choice(name: 'CLOUD_STORAGE', choices: ['s3', 'bos'], description: '云存储：海外使用S3，大陆使用BOS')
  }
  environment {
    MERCHANT_NO = "${params.MERCHANT_NO}"
    IS_FULL = "${params.IS_FULL}"
    CLOUD_STORAGE = "${params.CLOUD_STORAGE}"
    PROJECT_NAME = "h5"
    IMAGE_NAME = "369181834085.dkr.ecr.ap-east-1.amazonaws.com/overseas-${PROJECT_NAME}:${MERCHANT_NO}-${BRANCH_NAME}.${BUILD_ID}"
    APOLLO_URL = credentials('apollo-url')
    APOLLO_AUTH = credentials('apollo-auth')
    CM_URL = credentials('k8s-cm-url')
    CM_AUTH = credentials('k8s-cm-auth')
  }
  stages {
    stage('Full deploy to AWS') {
      when {
        environment name: 'IS_FULL', value: "true"
      }
      steps {
        sh '''
        echo "Full deploy to AWS"
        mkdir ./cm
        curl -u ${CM_AUTH} ${CM_URL} -o ./cm/code.zip -s
        unzip ./cm/code.zip -d ./cm
        sed -i s#branchname#${BRANCH_NAME}#g ./cm/merchant/frontend/${PROJECT_NAME}.yml
        kubectl -n merchant-${MERCHANT_NO} apply -f ./cm/merchant/frontend/${PROJECT_NAME}.yml
        rm -rf ./cm
        '''
      }
    }
    stage('Build dist') {
      steps {
        sh '''
        echo "---Build dist---"
        curl -u ${APOLLO_AUTH} ${APOLLO_URL}/acebet.frontend/${MERCHANT_NO}/application,${PROJECT_NAME} -o .env -s
        sed -i s#{projectname}#${PROJECT_NAME}#g .env
        sed -i s#{jumptype}#m#g .env
        sed -i s#VUE_APP#VITE_APP#g .env
        rm -rf node_modules
        npm i
        node scripts/patches
        npm run build ${MERCHANT_NO}
        '''
      }
    }
    stage('Sync to S3') {
      when {
        environment name: 'CLOUD_STORAGE', value: 's3'
      }
      steps {
        sh '''
        echo "Sync to S3"
        merchant_hash=$(echo -n "${MERCHANT_NO}"|md5sum |cut -d" " -f1)
        aws s3 sync dist s3://arn:aws:s3:ap-east-1:369181834085:accesspoint/overseas/${merchant_hash}/${PROJECT_NAME} --exclude '*.html' --acl public-read
        '''
      }
    }
    stage('Sync to BOS') {
      when {
        environment name: 'CLOUD_STORAGE', value: 'bos'
      }
      steps {
        sh '''
        echo "Sync to BOS"
        merchant_hash=$(echo -n "${MERCHANT_NO}"|md5sum |cut -d" " -f1)
        bce bos sync dist bos:/acebet-assets/${merchant_hash}/${PROJECT_NAME} --exclude './*.html' --exclude './*.htm' --yes
        '''
      }
    }
    stage('Push image to AWS') {
      steps {
        sh '''
        echo "---Push image to AWS---"
        docker build -t $IMAGE_NAME .
        docker push $IMAGE_NAME
        docker rmi -f $IMAGE_NAME
        '''
      }
    }
    stage('Deploy to AWS') {
      steps {
        sh '''
        echo "Deploy to AWS"
        kubectl -n merchant-${MERCHANT_NO} set image deployment frontend-${PROJECT_NAME} frontend-${PROJECT_NAME}=${IMAGE_NAME}
        '''
      }
    }
  }

  post {
    always {
      script {
        cid="19:d986e0d86fb54b738248982214f44006@thread.skype"
        if (currentBuild.currentResult == 'SUCCESS') {
          status="1"
        } else {
          status="0"
        }
        url="${NOTIFY_URL}?cid=${cid}&name=${JOB_NAME}&no=${currentBuild.number}&merchant_no=${params.MERCHANT_NO}&lang=${currentBuild.duration}&url=${BUILD_URL}&status=${status}"
        if (IS_FULL == 'true') {
          url="${url}&full"
        }
        sh "curl '${url}' -s"
      }
    }
  }

}
