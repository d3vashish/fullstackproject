pipeline {

    agent any

    environment {
        DOCKER_IMAGE_BACKEND = 'devashish13/taskmanager-backend'
        DOCKER_IMAGE_FRONTEND = 'devashish13/taskmanager-frontend'
        DOCKER_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {

            parallel {

                stage('Build Backend Image') {
                    steps {
                        dir('backend') {

                            sh """
                            docker build \
                            -t ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG} \
                            -t ${DOCKER_IMAGE_BACKEND}:latest .
                            """
                        }
                    }
                }

                stage('Build Frontend Image') {
                    steps {
                        dir('frontend') {

                            sh """
                            docker build \
                            -t ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} \
                            -t ${DOCKER_IMAGE_FRONTEND}:latest .
                            """
                        }
                    }
                }
            }
        }

        stage('Push Docker Images') {

            when {
                branch 'main'
            }

            steps {

                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    sh '''
                    echo $DOCKER_PASS | docker login \
                    -u $DOCKER_USER --password-stdin
                    '''

                    sh """
                    docker push ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG}
                    docker push ${DOCKER_IMAGE_BACKEND}:latest

                    docker push ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG}
                    docker push ${DOCKER_IMAGE_FRONTEND}:latest
                    """
                }
            }
        }

        stage('Deploy') {

            when {
                branch 'main'
            }

            steps {

                sh '''
                docker compose down || true
                docker compose up -d
                '''
            }
        }
    }

    post {

        success {
            echo "Pipeline succeeded! Docker Tag: ${DOCKER_TAG}"
        }

        failure {
            echo "Pipeline failed!"
        }

        always {
            sh 'docker system prune -f || true'
        }
    }
}