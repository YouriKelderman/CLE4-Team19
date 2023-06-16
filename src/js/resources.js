import {ImageSource, Sound, Resource, Loader} from 'excalibur';
import logo from '../images/logo.png';
import start from '../images/start.png';
import pan from '../images/Bami_Tower.png';
import kevin from '../images/kevin.png';
import map1ground from '../images/map-1-ground.png'
import range from "../images/range.png";
import bami from "../images/bami.png"
const Resources = {
    Logo: new ImageSource(logo),
    Start: new ImageSource(start),
    Pan: new ImageSource(pan),
Kevin: new ImageSource(kevin),
    Map1Ground: new ImageSource(map1ground),
    Range: new ImageSource(range),
    Bami: new ImageSource(bami)
};
const ResourceLoader = new Loader([
    Resources.Logo,
    Resources.Start,
    Resources.Pan,
    Resources.Kevin,
    Resources.Map1Ground,
    Resources.Range,
    Resources.Bami,
]);

export {Resources, ResourceLoader};