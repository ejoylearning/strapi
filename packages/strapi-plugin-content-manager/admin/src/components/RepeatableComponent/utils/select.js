import { useContentManagerEditViewDataManager } from '@toanz/strapi-helper-plugin';

function useSelect() {
  const { addRepeatableComponentToField, formErrors } = useContentManagerEditViewDataManager();

  return {
    addRepeatableComponentToField,
    formErrors,
  };
}

export default useSelect;
