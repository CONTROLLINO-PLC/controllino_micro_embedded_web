import { Switch } from '@headlessui/react'

export function Toggle(props) {

  return (
    <Switch
      checked={props.enabled}
      onChange={props.setEnabled}
      onClick={props.onClick}
      className={`${
        props.enabled ? 'bg-primary/50' : 'bg-gray-400/50'
      } relative inline-flex h-3 w-10 items-center rounded-full`}
    >
      <span
        className={`${
          props.enabled ? 'translate-x-5 bg-primary' : 'translate-x-0 bg-gray-400'
        } inline-block h-5 w-5 transform rounded-full transition`}
      />
    </Switch>
  )
}