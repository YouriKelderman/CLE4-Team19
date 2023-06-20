import {ImageSource, Sound, Resource, Loader, Color, Vector} from 'excalibur';

// logo
import logo from '../images/logo.png';

// menu
import loading from '../images/loading.png';
import start from '../images/start.png';
import menuSpider from '../images/menu-spider.png';

import range from '../images/range.png';
// park
import bami from '../images/bami.png';
import pan from '../images/bami-pan.png';
import kevin from '../images/kevin.png';
import spider from '../images/spider.png';
import Mouse from '../images/muis.png';

import map1ground from '../images/map-1-ground.png';
import map1top from '../images/map-1-top.png';
import menuMusic from '../sounds/menuMusic.mp3';
import backgroundMusic from '../sounds/backgroundMusic.mp3';

//gui
import playButton from '../images/play-button.png';
import settingsButton from '../images/settings-button.png';
import menuButton from '../images/menu-button.png';


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

    Range: new ImageSource(range),
    Bami: new ImageSource(bami),
    Map1Top: new ImageSource(map1top),

    PlayButton: new ImageSource(playButton),
    SettingsButton: new ImageSource(settingsButton),
    MenuButton: new ImageSource(menuButton),

    MenuMusic: new Sound(menuMusic),
    BackgroundMusic: new Sound(backgroundMusic),


    SliderBase: new ImageSource(sliderBase),
    SliderHead: new ImageSource(sliderHead),
Mouse: new ImageSource(Mouse),
    Spider: new ImageSource(spider)

};

const ResourceLoader = new Loader([
    Resources.Logo,
    Resources.Loading,
    Resources.Start,
    Resources.MenuSpider,
    Resources.Pan,
    Resources.Kevin,
    Resources.Map1Ground,
    Resources.Range,
    Resources.Bami,
    Resources.Map1Top,
    Resources.PlayButton,
    Resources.SettingsButton,
    Resources.MenuButton,

    Resources.MenuMusic,
    Resources.BackgroundMusic,
    Resources.SliderBase,
    Resources.SliderHead,
    Resources.Spider,
Resources.Mouse,
]);

// Excaliber logo
ResourceLoader.logo = loading;
ResourceLoader.logoWidth = 550;
ResourceLoader.logoHeight = 250;
ResourceLoader.backgroundColor = new Color(239, 255, 228);
ResourceLoader.loadingBarColor = '#3ca370';
ResourceLoader.suppressPlayButton = false;
ResourceLoader.playButtonText = 'Speel!';


export {Resources, ResourceLoader};