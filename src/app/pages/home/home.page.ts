import { Component } from '@angular/core';
import { Camera, PictureSourceType } from '@ionic-native/camera/ngx';
import { ActionSheetController, NavController } from '@ionic/angular';
// import * as Tesseract from 'tesseract.js';
import { createWorker } from 'tesseract.js';
import { NgProgress } from '@ngx-progressbar/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  selectedImage: string;
  imageText: string;
 
  constructor(public navCtrl: NavController, private camera: Camera, private actionSheetCtrl: ActionSheetController, public progress: NgProgress) {
  }
 
  async selectSource() {    
    let actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Use Library',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        }, {
          text: 'Capture Image',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.CAMERA);
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
 
  getPicture(sourceType: PictureSourceType) {
    this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: sourceType,
      allowEdit: true,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }).then((imageData) => {
      this.selectedImage = `data:image/jpeg;base64,${imageData}`;
    });
  }
 
  //  recognizeImage() {
  //   Tesseract.recognize(this.selectedImage)
  //   .progress(message => {
  //     if (message.status === 'recognizing text')
  //     this.progress.set(message.progress);
  //   })
  //   .catch(err => console.error(err))
  //   .then(result => {
  //     this.imageText = result.text;
  //   })
  //   .finally(resultOrError => {
  //     this.progress.complete();
  //   });
  // }


  async doOCR() {
    const worker = createWorker({
      logger: m => console.log(m),
    });
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(this.selectedImage);
    this.imageText = text;
    console.log(text);
    await worker.terminate();
  }
}
