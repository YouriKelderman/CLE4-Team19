import {ImageSource, Sound, Resource, Loader, Color, Vector} from 'excalibur';

// logo
import logo from '../images/logo.png';
import pausedLogo from '../images/paused-logo.png';
import HervatButton from '../images/HervatButton.png';
import Volumeup from '../images/Volume-up.png';
import Volumedown from '../images/Volume-down.png';
import Mutebutton from '../images/MuteButton.png';
import fontFile from "../VCR_OSD_MONO_1.001.ttf";
import web from '../images/web.png';
import explosiveWeb from '../images/explosive-web.png';
import gameover from '../images/gameover.png';
import selectText from '../images/selecttext.png';


import whoosh from '../sounds/whoosh.mp3'
import thud from '../sounds/536766__egomassive__thud.mp3'
import smash from '../sounds/smash.wav'

// menu
import loading from '../images/loading.png';
import start from '../images/start.png';
import menuSpider from '../images/menu-spider.png';
import range from '../images/range.png';
import upgrade from '../images/UpgradeButton.png';
import rangeIndicator from '../images/rangeIndicator.png';
import damageIndicator from '../images/damageIndicator.png';
import targetingSymbol from '../images/targetingSymbol.png';
// park
import bami from '../images/bami.png';
import spicyBami from '../images/spicyBami.png';
import pan from '../images/pan-bami.png';
import aboutaleb from '../images/aboutaleb.png';
import tinyLau from '../images/TinyLau_Tower.png';

import spidermeneer from '../images/spider-meneer.png';
import spiderTrike from '../images/SpinManTrike_Sprite.png'
import laser from '../images/laser.png'
import spider from '../images/spider.png';
import mouse from '../images/muis.png';
import rat from '../images/rat.png';
import racoon from '../images/racoon.png'
import snail from '../images/snail.png'
//Garden
import garden from "../images/garden.png"
import garden1 from "../images/garden-1.png"
import garden2 from "../images/garden-2.png"
import garden3 from "../images/garden-3.png"
import garden4 from "../images/garden-4.png"
import map1ground from '../images/map-1-ground.png';
import map1top from '../images/map-1-top.png';
import map2ground from '../images/map-2-ground.png';
import map2top from '../images/map-2-top.png';
import click from '../sounds/click.wav';
import menuMusic from '../sounds/Main_Menu.mp3';
import settingsMusic from '../sounds/Settings_1.mp3';
import backgroundMusic from '../sounds/backgroundMusic.mp3';
import crunch from '../sounds/crunch.mp3';
import plop from '../sounds/plop.mp3'
import parkMusic from '../sounds/parkSong.mp3';
import UpgradeButton from '../images/UpgradeButton.png';
import SwearUit from '../images/swearOff.png';
import SwearAan from '../images/swearOn.png';


// map select screens
import parkMapselect from '../images/parkmapselect.png';
import parkMapSelect2 from '../images/parkmapselect2.png';


//gui
import playButton from '../images/play-button.png';
import settingsButton from '../images/settingsButton.png';
import buyButton from '../images/BuyLogo.png';
import menuButton from '../images/menu-button.png';
import sideButton from '../images/side-button.png';
import buyMenu from '../images/BuyMenuBar.png';
import Gulden from '../images/Gulden.png';
import Health from '../images/Levens.png';
import costLogo from '../images/costLogo.png';


const font = new FontFace("VCR", `url(${fontFile})`)
document.fonts.add(font)
font.load()

const Resources = {
    Logo: new ImageSource(logo),
    PausedLogo: new ImageSource(pausedLogo),
    HervatButton: new ImageSource(HervatButton),
    Volumeup: new ImageSource(Volumeup),
    Volumedown: new ImageSource(Volumedown),
    Mutebutton: new ImageSource(Mutebutton),
    Web: new ImageSource(web),
    ExplosiveWeb: new ImageSource(explosiveWeb),
    GameOver: new ImageSource(gameover),
    SelectText: new ImageSource(selectText),


    Whoosh: new Sound(whoosh),
    Thud: new Sound(thud),
    Garden: new ImageSource(garden),
    Garden1: new ImageSource(garden1),
    Garden2: new ImageSource(garden2),
    Garden3: new ImageSource(garden3),
    Garden4: new ImageSource(garden4),
    Loading: new ImageSource(loading),
    Start: new ImageSource(start),
    MenuSpider: new ImageSource(menuSpider),
    Pan: new ImageSource(pan),
    SpicyPan: new ImageSource(spicyBami),
    TinyLau: new ImageSource(tinyLau),
    SpiderTrike: new ImageSource(spiderTrike),
    Map1Ground: new ImageSource(map1ground),
    Map2Ground: new ImageSource(map2ground),
    SpiderMeneer: new ImageSource(spidermeneer),
    Range: new ImageSource(range),
    Bami: new ImageSource(bami),
    aboutaleb: new ImageSource(aboutaleb),
    Map1Top: new ImageSource(map1top),
    Map2Top: new ImageSource(map2top),
    ParkMapselect: new ImageSource(parkMapselect),
    ParkMapSelect2: new ImageSource(parkMapSelect2),
    RangeIndicator: new ImageSource(rangeIndicator),
    DamageIndicator: new ImageSource(damageIndicator),
    Laser: new ImageSource(laser),
    PlayButton: new ImageSource(playButton),
    SettingsButton: new ImageSource(settingsButton),
    UpgradeButton: new ImageSource(UpgradeButton),
    SwearUit: new ImageSource(SwearUit),
    SwearAan: new ImageSource(SwearAan),

    BuyButton: new ImageSource(buyButton),
    MenuButton: new ImageSource(menuButton),
    SideButton: new ImageSource(sideButton),
    BuyMenu: new ImageSource(buyMenu),
    Gulden: new ImageSource(Gulden),
    Health: new ImageSource(Health),
    TargetingSymbol: new ImageSource(targetingSymbol),
    CostLogo: new ImageSource(costLogo),


    Click: new Sound(click),
    MenuMusic: new Sound(menuMusic),
    BackgroundMusic: new Sound(backgroundMusic),
    SettingsMusic: new Sound(settingsMusic),
    ParkMusic: new Sound(parkMusic),
    Crunch: new Sound(crunch),
    Smash: new Sound(smash),
    Upgrade: new Sound(upgrade),
    Plop: new Sound(plop),
    Mouse: new ImageSource(mouse),
    Spider: new ImageSource(spider),
    Rat: new ImageSource(rat),
    Racoon: new ImageSource(racoon),
    Snail: new ImageSource(snail),
};


const resourceArray = []
for (const key in Resources) {
    resourceArray.push(Resources[key])
}
const ResourceLoader = new Loader(resourceArray)


// Excaliber logo
ResourceLoader.logo = loading;
ResourceLoader.logoWidth = 550;
ResourceLoader.logoHeight = 250;
ResourceLoader.backgroundColor = new Color(239, 255, 228);
ResourceLoader.loadingBarColor = '#3ca370';
ResourceLoader.suppressPlayButton = false;
ResourceLoader.playButtonText = 'Speel!';


export {Resources, ResourceLoader};