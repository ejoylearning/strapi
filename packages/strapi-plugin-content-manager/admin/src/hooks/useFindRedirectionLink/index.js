import { useSelector } from 'react-redux';
import { useQueryParams } from '@toanz/strapi-helper-plugin';
import selectMenuLinks from './selectors';
import getRedirectionLink from './utils/getRedirectionLink';

const useFindRedirectionLink = (slug) => {
  const [{ rawQuery }] = useQueryParams();
  const collectionTypesMenuLinks = useSelector(selectMenuLinks);
  const redirectionLink = getRedirectionLink(collectionTypesMenuLinks, slug, rawQuery);

  return redirectionLink;
};

export default useFindRedirectionLink;
