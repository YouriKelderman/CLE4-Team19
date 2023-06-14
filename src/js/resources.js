import { ImageSource, Sound, Resource, Loader } from 'excalibur'
import fishImage from '../images/fish.png'
import rock from '../images/rock.png'
const Resources = {
    Fish: new ImageSource(fishImage),
    Rock: new ImageSource(rock)
}
const ResourceLoader = new Loader([Resources.Fish, Resources.Rock])

export { Resources, ResourceLoader }