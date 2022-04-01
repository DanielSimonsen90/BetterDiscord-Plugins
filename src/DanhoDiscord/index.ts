import { createPlugin } from 'discordium';
import config from './config.json';
import styles from './styles.scss';

export default createPlugin({...config, styles}, ({  }) => {
    return {
        start() {

        },
        stop() {

        },
        // settingsPanel({ defaults, set }) {
            
        // }
    }
})