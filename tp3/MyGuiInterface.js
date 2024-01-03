import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { MyApp } from "./MyApp.js";
import { MyContents } from "./MyContents.js";

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface {
  /**
   *
   * @param {MyApp} app The application object
   */
  constructor(app) {
    this.app = app;
    this.datgui = new GUI();
    this.contents = null;
  }

  /**
   * Set the contents object
   * @param {MyContents} contents the contents objects
   */
  setContents(contents) {
    this.contents = contents;
  }

  /**
   * Initialize the gui interface
   */
  init() {
    const cameraFolder = this.datgui.addFolder('Camera')
    
    const cameraSwitch = cameraFolder.add(this.app, 'activeCameraName', ['Perspective', 'Normal'])
    .name("active camera");

  cameraSwitch.onChange((value) => {
    this.app.setActiveCamera(value);
  });
    cameraFolder.open();

  }
}

export { MyGuiInterface };