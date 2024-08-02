import { select } from '@storybook/addon-knobs';
import classNames from 'classnames';

import sharedOptions from '../_helpers/shared';

export default () => {
  const textareaOption = select('Textarea Classes', {
    default: '',
    ...sharedOptions,
  }, '');

  const textareaClasses = classNames(
    'nes-textarea',
    textareaOption,
  );

  return `
    <textarea id="textarea_field" className="${textareaClasses}" placeholder="NES.css"></textarea>
  `;
};
