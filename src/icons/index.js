import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'

// Register the SvgIcon component globally
Vue.component('svg-icon', SvgIcon)
const req = require.context("./svg", false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)


// We're not using sprite loader, as we're directly importing SVGs in the component 