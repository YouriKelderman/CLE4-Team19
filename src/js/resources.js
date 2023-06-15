import {ImageSource, Sound, Resource, Loader, Color, Vector} from 'excalibur';

// logo
import logo from '../images/logo.png';

// menu
import loading from '../images/loading.png';
import start from '../images/start.png';
import menuSpider from '../images/menu-spider.png';


import pan from '../images/Bami_Tower.png';
import kevin from '../images/kevin.png';
import map1ground from '../images/map-1-ground.png';
import map1top from '../images/map-1-top.png';
import menuMusic from '../sounds/menuMusic.mp3';

// play & pause
import playButton from '../images/play-button.png';

// slider
import sliderBase from '../images/slider-base.png';
import sliderHead from '../images/slider-head.png';


const Resources = {
    Logo: new ImageSource(logo),
    Loading: new ImageSource(loading),
    Start: new ImageSource(start),
    MenuSpider: new ImageSource(menuSpider),
    Pan: new ImageSource(pan),
    Kevin: new ImageSource(kevin),
    Map1Ground: new ImageSource(map1ground),
    Map1Top: new ImageSource(map1top),

    PlayButton: new ImageSource(playButton),
    MenuMusic: new Sound(menuMusic),

    SliderBase: new ImageSource(sliderBase),
    SliderHead: new ImageSource(sliderHead)

};

const ResourceLoader = new Loader([
    Resources.Logo,
    Resources.Loading,
    Resources.Start,
    Resources.MenuSpider,
    Resources.Pan,
    Resources.Kevin,
    Resources.Map1Ground,
    Resources.Map1Top,
    Resources.PlayButton,
    Resources.MenuMusic,

    Resources.SliderBase,
    Resources.SliderHead,

]);

// Excaliber logo
ResourceLoader.logo = loading;
ResourceLoader.logoWidth = 550;
ResourceLoader.logoHeight = 250;
ResourceLoader.backgroundColor = new Color(239, 255, 228);
ResourceLoader.loadingBarColor = '#3ca370';
ResourceLoader.suppressPlayButton = true;
ResourceLoader.playButtonText = 'Speel!';


export {Resources, ResourceLoader};