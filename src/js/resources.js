import {ImageSource, Sound, Resource, Loader} from 'excalibur';
import logo from '../images/logo.png';
import start from '../images/start.png';
import rock from '../images/rock.png';
import kevin from '../images/kevin.png';
import map1ground from '../images/map-1-gorund.png'
const Resources = {
    Logo: new ImageSource(logo),
    Start: new ImageSource(start),
    Rock: new ImageSource(rock),
Kevin: new ImageSource(kevin),
    Map1Ground: new ImageSource(map1ground),
};
const ResourceLoader = new Loader([
    Resources.Logo,
    Resources.Start,
    Resources.Rock,
    Resources.Kevin,
    Resources.Map1Ground,
]);

export {Resources, ResourceLoader};