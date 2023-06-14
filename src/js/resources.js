import {ImageSource, Sound, Resource, Loader} from 'excalibur';
import logo from '../images/logo.png';
import start from '../images/start.png';

const Resources = {
    Logo: new ImageSource(logo),
    Start: new ImageSource(start),

};
const ResourceLoader = new Loader([
    Resources.Logo,
    Resources.Start
]);

export {Resources, ResourceLoader};