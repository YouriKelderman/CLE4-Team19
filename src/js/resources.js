import {ImageSource, Sound, Resource, Loader} from 'excalibur';
import logo from '../images/logo.png';
import start from '../images/start.png';
import pan from '../images/Bami_Tower.png';
import kevin from '../images/kevin.png';
const Resources = {
    Logo: new ImageSource(logo),
    Start: new ImageSource(start),
    Pan: new ImageSource(pan),
Kevin: new ImageSource(kevin),
};
const ResourceLoader = new Loader([
    Resources.Logo,
    Resources.Start,
    Resources.Pan,
    Resources.Kevin,
]);

export {Resources, ResourceLoader};