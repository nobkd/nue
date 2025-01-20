export async function findUserData() {
  // TODO: find username, check for ssh key, check if remote user repo exists

  return {
    base: null, // set, if not on <username>.github.io but <username>.github.io/<somedir>
    is_prod: true, // always prod
  }
}

export async function push(data, root){
  // TODO: handle pushing to remote, finalizing steps to publish page
}
