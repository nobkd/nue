export async function findUserData() {
  data = {
    is_prod: true, // always prod
  }

  // TODO: find username, check for ssh key, check if remote user repo exists


  if (!data.user) {
    // ask user for uname
  } else {
    // found <uname>, do you agree?
  }

  data.repo = `${uname}.github.io`
  
  // ask if user agrees with repo
  // else use provided repo and set `base` to subpath
  // data.base = null // set, if not on <username>.github.io but <username>.github.io/<somedir>

  // check if repo already exists, etc.
  // fetch(`https://api.github.com/repos/${data.user}/${data.repo}`)
  // or git ls-remote --exit-code git@github.com:johndoe/my-cool-repo.git

  // more

  return data
}

export async function push(data, root) {
  // TODO: handle pushing to remote, finalizing steps to publish page
}
