pipeline {
    agent {
        label 'cimp'
    }
    environment {
        buildDockerCompose_BE = "sudo docker compose -f docker-compose.yml -f docker-compose.override.yml build"
        buildDockerCompose_FE = "sudo docker compose build"
    }
    stages {
        // stage('Checkout-Repo') {
        //     steps {
        //         git branch: "${branch}", url: 'https://ghp_JwRo8YmbdlAdzVYv9B1QMmEbSGRZpw1B692A@github.com/huynnguyen102/promotionapp-ui.git'
        //         sh 'git rev-parse --short HEAD > commit-id'
        //         script {
        //             def tag = readFile('commit-id').replace("\n", "").replace("\r", "")
        //             def appName = "promotionapp-ui"
        //             def registryHost = "${registryHost}"
        //             def imgName = "${registryHost}/${appName}:${tag}"
        //             def buildTag = "${tag}"


        //             env.imageName = "${imgName}"
        //             env.BUILD_TAG = "${buildTag}"
        //         }
        //     }
        // }
        stage('Install dependencies') {
            steps {
                script {
                    // cấp quyền docker.sock
                    sh 'sudo chmod 777 /var/run/docker.sock'


                    // def awsCLIInstalled = sh(
                    //     script: 'which aws || echo "not_installed"',
                    //     returnStdout: true
                    // ).trim()


                    // if (awsCLIInstalled == 'not_installed') {
                    //     echo "AWS CLI is not installed. Installing now..."
                    //     sh '''
                    //         curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
                    //         unzip awscliv2.zip
                    //         sudo ./aws/install --bin-dir /usr/local/bin --install-dir /usr/local/aws-cli --update
                    //         rm -rf awscliv2.zip aws
                    //     '''
                    // } else {
                    //     echo "AWS CLI is already installed at: ${awsCLIInstalled}"
                    // }
                    // install K8S CLI
                    def k8sCLIInstalled = sh(
                        script: 'which kubectl || echo "not_installed"',
                        returnStdout: true
                    ).trim()


                    if (k8sCliInstalled == 'not_installed') {  
                        echo "K8S CLI is not installed. Installing now..."  
                        sh '''  
                        curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"  
                        echo "%(cat kubectl.sha256) kubectl" | sha256sum --check  
                        sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl  
                        kubectl version --client  
                        '''  
                    } else {  
                        echo "K8S CLI is already installed at: ${k8sCliInstalled}"  
                    }  
                }
            }
        }
        // stage('Setup AWS Credentials') {
        //     steps {
        //         script {
        //             sh '''
        //                 mkdir -p ~/.aws
        //                 echo "[default]" > ~/.aws/credentials
        //                 echo "aws_access_key_id=${aws_access_key_id}" >> ~/.aws/credentials
        //                 echo "aws_secret_access_key=${aws_secret_access_key}" >> ~/.aws/credentials
        //                 echo "[default]" > ~/.aws/config
        //                 echo "region=${region}" >> ~/.aws/config
        //                 chmod 600 ~/.aws/credentials ~/.aws/config
        //             '''
        //             // Setup kubeconfig từ EKS
        //             sh 'aws eks update-kubeconfig --region ${region} --name ${cluster_name}'
        //         }
        //     }
        // }
        stage('Build-Image') {
            steps {
                sh(script: """ whoami;pwd; """, label: "build docker compose")

                //Build BE
                sh(script: """ cd be && ${buildDockerCompose_BE} """, label: "build docker compose")

                //Build FE
                sh(script: """ cd fe && ${buildDockerCompose_FE} """, label: "build docker compose")

                sh('''docker tag cimpapigateway:latest tahai/cimpapigateway:latest''')
                sh('''docker tag cimpapi:latest tahai/cimpapi:latest''')
                sh('''docker tag cimppublicapi:latest tahai/cimppublicapi:latest''')
                sh('''docker tag cimphelpdeskapi:latest tahai/cimphelpdeskapi:latest''')
                sh('''docker tag cimpintegrationapi:latest tahai/cimpintegrationapi:latest''')
                sh('''docker tag cimpfe:latest tahai/cimpfe:latest''')
                sh('''docker tag cimpmigrationrunner:latest tahai/cimpmigrationrunner:latest''')

            }
        }
        
        // stage('SonarQube analysis') {  
        //     steps {  
        //         script {  
        //             withSonarQubeEnv('Sonar server') {  
        //                 sh """  
        //                 ${scannerHome}/bin/sonar-scanner \
        //                 -Dsonar.projectKey=${projectKey} \
        //                 -Dsonar.sources=. \
        //                 -Dsonar.host.url=${sonar_host_url} \
        //                 -Dsonar.login=${token_auth_sonar_project}  
        //                 """  
        //             }  
        //         }  
        //     }  
        // }  
        stage('Push-Docker-Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: '', usernameVariable: '', passwordVariable: '')]) {
                    sh "echo  | docker login -u  --password-stdin"
                    sh('''docker push tahai/cimpapigateway:latest''')
                    sh('''docker push tahai/cimpapi:latest''')
                    sh('''docker push tahai/cimppublicapi:latest''')
                    sh('''docker push tahai/cimphelpdeskapi:latest''')
                    sh('''docker push tahai/cimpintegrationapi:latest''')
                    sh('''docker push tahai/cimpmigrationrunner:latest''')
                    sh('''docker push tahai/cimpfe:latest''')
                }
            }
        }


        stage('Deploy') {
            steps {
                sh 'cat Deployment.yml | sed "s/{{BUILD_TAG}}/${BUILD_TAG}/g" | kubectl apply -f -'
            }
        }
    }
}
