export default function ({ store, redirect }) {
  //If the user is notAuthenticated
  if (store.state.auth.user.groups === "Cliente" || store.state.auth.user.groups === "Projetista") {
    return redirect('/home')
  }
}
