import PropTypes from 'prop-types';

export function InfoCard(props) {
  return (
    <div
      className="flex py-6 min-w-80 rounded-sm bg-[#404038] gap-1 text-primary justify-center"
    >
      {props.icon}
      <p className="text-white">{props.text}</p>
    </div>
  )
}

InfoCard.propTypes = {
  icon: PropTypes.element.isRequired,
  text: PropTypes.string.isRequired,
};
