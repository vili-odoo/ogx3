import 'sanitize.css'
import 'sanitize.css/assets.css'
import 'sanitize.css/system-ui.css'
import 'sanitize.css/typography.css'
import './app.css'
import App from './components/App.svelte'

const app = new App({
  target: document.getElementById('app'),
})

export default app
