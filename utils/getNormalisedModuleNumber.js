export default function getNormalisedModuleNumber(module) {
  // turn from 1-6,1-6 to 1-12
  return module.level === 'stage' ? module.order + 6 : module.order;
}
