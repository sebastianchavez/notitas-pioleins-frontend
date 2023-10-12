import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore'
import { firstValueFrom, map } from 'rxjs';
import { IUser } from 'src/app/model/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userCollection: AngularFirestoreCollection<IUser>

  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
  ) { 
    this.userCollection = this.angularFirestore.collection('users')
  }

  async login(){
    try {
      // TODO: Autenticar con google
      const responseGoogle = await this.angularFireAuth.signInWithPopup(new  GoogleAuthProvider())
      const profile: any = responseGoogle.additionalUserInfo?.profile
      
      // TODO: Buscar usuario por email
      this.userCollection = this.angularFirestore.collection<IUser>('users', (ref => ref.where('email', '==', profile.email).limit(1)))
      const users = await firstValueFrom(this.userCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => a.payload.doc.data() as IUser))
      ))

      if(users && users.length > 0){
        // TODO: Si usuario existe, retornar promesa resuelta
        return true
      } else {
        // TODO: Si usuario no existe Registrar usuario
        const idUser = this.angularFirestore.createId()
        const user: IUser = {
          idUser,
          email: profile.email,
          name: profile.name,
          profileImage: profile.picture,
          state: 'enabled',
          typeAuthentication: 'google',
          createdAt: Date.now(), // Date
          updatedAt: Date.now()
        }
        return this.userCollection.doc(idUser).set(user)
      } 
    } catch (error) {
      throw error      
    }
  }

  getStatus(){

  }

  logOut(){

  }
}
