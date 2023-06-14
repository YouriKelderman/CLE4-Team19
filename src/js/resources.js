import {ImageSource, Sound, Resource, Loader} from 'excalibur';
import logo from '../images/logo.png';
import start from '../images/start.png';
import rock from '../images/rock.png';

const Resources = {
    Logo: new ImageSource(logo),
    Start: new ImageSource(start),
    Rock: new ImageSource(rock),

};
const ResourceLoader = new Loader([
    Resources.Logo,
    Resources.Start,
    Resources.Rock
]);

export {Resources, ResourceLoader};