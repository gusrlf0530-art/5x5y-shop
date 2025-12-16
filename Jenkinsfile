pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  environment {
    IMAGE = "ghcr.io/jwahn2018-rgb/5x5y-shop"
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm

        // checkout 이후에 정확한 값으로 세팅
        script {
          env.COMMIT_SHA = sh(script: "git rev-parse HEAD", returnStdout: true).trim()

          // Jenkins 변수(BRANCH_NAME)가 믿을 수 없으니,
          // 실제로 우리가 빌드한 원격 브랜치명을 강제로 알아낸다.
          // (refs/remotes/origin/<branch> 형태에서 <branch>만 뽑음)
          env.SRC_BRANCH = sh(
            script: "git branch -r --contains HEAD | sed -n 's#.*origin/##p' | head -n 1",
            returnStdout: true
          ).trim()

          if (!env.SRC_BRANCH) {
            // 최후의 보험: test 브랜치로 고정(너 지금 테스트 중이니까)
            env.SRC_BRANCH = "test-static-index"
          }

          env.TAG = env.COMMIT_SHA

          echo "Checked out commit: ${env.COMMIT_SHA}"
          echo "Detected source branch: ${env.SRC_BRANCH}"
          echo "Image tag: ${env.TAG}"
        }
      }
    }

    stage('Build & Push (buildah)') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'ghcr-cred',
          usernameVariable: 'GH_USER', passwordVariable: 'GH_PAT')]) {
          sh '''
            set -eux
            sudo buildah login ghcr.io -u "$GH_USER" -p "$GH_PAT"
            sudo buildah bud -f Containerfile -t "$IMAGE:$TAG" .
            sudo buildah push "$IMAGE:$TAG"
          '''
        }
      }
    }

    stage('Bump kustomize tag & push') {
      steps {
        withCredentials([string(credentialsId: 'github-push', variable: 'GIT_PAT')]) {
          sh '''
            set -eux

            # 안전: 브랜치명은 Jenkins BRANCH_NAME 믿지 말고, 우리가 감지한 SRC_BRANCH로 고정
            BR="${SRC_BRANCH}"

            git config user.name "jenkins"
            git config user.email "jenkins@local"

            # 원격 최신 상태 가져오고(안 하면 non-fast-forward 계속 남)
            git remote set-url origin https://jwahn2018-rgb:${GIT_PAT}@github.com/jwahn2018-rgb/5x5y-shop.git
            git fetch origin "${BR}"

            # 지금 워킹트리는 detached HEAD일 가능성이 높으니,
            # 임시 로컬 브랜치를 만들고 원격 브랜치에 리베이스해서 "앞서게" 만든다.
            git checkout -B "jenkins-${BR}" "origin/${BR}"

            # kustomize 파일 수정 (들여쓰기/구조 유지!)
            sed -i "s/^\\s*newTag:.*$/    newTag: ${TAG}/" k8s/overlays/dev/kustomization.yaml || true
            # ↑ 네 kustomization.yaml이 아래 형태일 때 기준:
            # images:
            # - name: ...
            #   newName: ...
            #   newTag: ...

            git add k8s/overlays/dev/kustomization.yaml

            # 변경 없으면 커밋 스킵
            if git diff --cached --quiet; then
              echo "No kustomize tag change. Skipping commit/push."
              exit 0
            fi

            git commit -m "dev: bump image tag to ${TAG}"

            # 원격이 또 앞서 있을 수 있으니 안전하게 rebase 후 push
            git pull --rebase origin "${BR}" || true

            git push origin "HEAD:${BR}"
          '''
        }
      }
    }
  }
}

