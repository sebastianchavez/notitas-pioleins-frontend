import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoteModalComponent } from './note-modal/note-modal.component';
import { INote } from 'src/app/model/interfaces/note.interface';
import { NoteService } from 'src/app/services/note/note.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { UserService } from 'src/app/services/user/user.service';
import { IUser } from 'src/app/model/interfaces/user.interface';
import { TypesNote } from 'src/app/common/enums/types-note.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  idLog: string = 'HomeComponent'
  user?: IUser
  notes: INote[] = []
  note: INote = {
    title: '',
    checks: [],
    createdAt: Date.now(),
    idUser: '',
    type: TypesNote.TASKLIST,
    updatedAt: Date.now()
  }

  constructor(
    private dialog: MatDialog,
    private noteService: NoteService,
    private logger: LoggerService,
    private userService: UserService,
  ){
    this.userService.user
      .subscribe(res => {
        if(res){
          this.user = res
          this.getNotes()
        }
      })
  }

  ngOnInit(): void {
  }

  openDialog(note?: INote){
    if(!note){
      this.clearNote()
    } else {
      this.note = note
    }
    const dialogRef = this.dialog.open(NoteModalComponent, {
      width: '30rem',
      data: this.note
    })
    dialogRef.afterClosed()
      .subscribe(async () => {       
        try {
          if(this.note.checks.length > 0 || this.note.title.trim() !== ''){
            this.note.checks.forEach((x,i) => {delete this.note.checks[i].state})
            const response = await this.noteService.createOrUpdate(this.note)
            this.logger.log(this.idLog, this.openDialog.name, {info: 'Success', response})
          }
        } catch (error) {
          this.logger.error(this.idLog, this.openDialog.name, {info: 'Error', error})
        }
      })
  }

  clearNote(){
    this.note = {
      title: '',
      checks: [],
      createdAt: Date.now(),
      idUser: this.user?.idUser!  ,
      type: TypesNote.TASKLIST,
      updatedAt: Date.now()
    }
  }

  getNotes(){
    this.noteService.getNotes(this.user?.idUser!)
      .subscribe(res => {
        this.notes = res
        this.logger.log(this.idLog, this.getNotes.name, {info: 'Success', response: res})
      })
  }
}
