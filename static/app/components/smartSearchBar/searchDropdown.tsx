import {Fragment, PureComponent} from 'react';
import styled from '@emotion/styled';
import color from 'color';

import LoadingIndicator from 'sentry/components/loadingIndicator';
import {parseSearch} from 'sentry/components/searchSyntax/parser';
import HighlightQuery from 'sentry/components/searchSyntax/renderer';
import {IconOpen} from 'sentry/icons';
import {t, tct} from 'sentry/locale';
import space from 'sentry/styles/space';
import {FieldKind} from 'sentry/utils/fields';

import Button from '../button';
import HotkeysLabel from '../hotkeysLabel';
import Tag from '../tag';

import SearchBarFlyout from './searchBarFlyout';
import type {SearchGroup, SearchItem, Shortcut} from './types';
import {ItemType} from './types';

const getDropdownItemKey = (item: SearchItem) =>
  `${item.value || item.desc || item.title}-${
    item.children && item.children.length > 0 ? getDropdownItemKey(item.children[0]) : ''
  }`;

type Props = {
  items: SearchGroup[];
  loading: boolean;
  onClick: (value: string, item: SearchItem) => void;
  searchSubstring: string;
  className?: string;
  maxMenuHeight?: number;
  onIconClick?: (value: string) => void;
  runShortcut?: (shortcut: Shortcut) => void;
  visibleShortcuts?: Shortcut[];
};

class SearchDropdown extends PureComponent<Props> {
  static defaultProps = {
    searchSubstring: '',
    onClick: function () {},
  };

  render() {
    const {
      className,
      loading,
      items,
      runShortcut,
      visibleShortcuts,
      maxMenuHeight,
      searchSubstring,
      onClick,
      onIconClick,
    } = this.props;

    return (
      <SearchBarFlyout className={className} fullWidth>
        {loading ? (
          <LoadingWrapper key="loading" data-test-id="search-autocomplete-loading">
            <LoadingIndicator mini />
          </LoadingWrapper>
        ) : (
          <SearchItemsList maxMenuHeight={maxMenuHeight}>
            {items.map(item => {
              const isEmpty = item.children && !item.children.length;

              // Hide header if `item.children` is defined, an array, and is empty
              return (
                <Fragment key={item.title}>
                  {item.type === 'header' && <HeaderItem group={item} />}
                  {item.children &&
                    item.children.map(child => (
                      <DropdownItem
                        key={getDropdownItemKey(child)}
                        item={child}
                        searchSubstring={searchSubstring}
                        onClick={onClick}
                        onIconClick={onIconClick}
                      />
                    ))}
                  {isEmpty && <Info>{t('No items found')}</Info>}
                </Fragment>
              );
            })}
          </SearchItemsList>
        )}

        <DropdownFooter>
          <ShortcutsRow>
            {runShortcut &&
              visibleShortcuts?.map(shortcut => {
                return (
                  <ShortcutButtonContainer
                    key={shortcut.text}
                    onClick={() => runShortcut(shortcut)}
                  >
                    <HotkeyGlyphWrapper>
                      <HotkeysLabel
                        value={
                          shortcut.hotkeys?.display ?? shortcut.hotkeys?.actual ?? []
                        }
                      />
                    </HotkeyGlyphWrapper>
                    <IconWrapper>{shortcut.icon}</IconWrapper>
                    <HotkeyTitle>{shortcut.text}</HotkeyTitle>
                  </ShortcutButtonContainer>
                );
              })}
          </ShortcutsRow>
          <Button size="xs" href="https://docs.sentry.io/product/sentry-basics/search/">
            Read the docs
          </Button>
        </DropdownFooter>
      </SearchBarFlyout>
    );
  }
}

export default SearchDropdown;

type HeaderItemProps = {
  group: SearchGroup;
};

const HeaderItem = ({group}: HeaderItemProps) => {
  return (
    <SearchDropdownGroup key={group.title}>
      <SearchDropdownGroupTitle>
        {group.icon}
        {group.title && group.title}
        {group.desc && <span>{group.desc}</span>}
      </SearchDropdownGroupTitle>
    </SearchDropdownGroup>
  );
};

type HighlightedRestOfWordsProps = {
  combinedRestWords: string;
  firstWord: string;
  searchSubstring: string;
  hasSplit?: boolean;
  isFirstWordHidden?: boolean;
};

const HighlightedRestOfWords = ({
  combinedRestWords,
  searchSubstring,
  firstWord,
  isFirstWordHidden,
  hasSplit,
}: HighlightedRestOfWordsProps) => {
  const remainingSubstr =
    searchSubstring.indexOf(firstWord) === -1
      ? searchSubstring
      : searchSubstring.slice(firstWord.length + 1);
  const descIdx = combinedRestWords.indexOf(remainingSubstr);

  if (descIdx > -1) {
    return (
      <RestOfWordsContainer isFirstWordHidden={isFirstWordHidden} hasSplit={hasSplit}>
        .{combinedRestWords.slice(0, descIdx)}
        <strong>
          {combinedRestWords.slice(descIdx, descIdx + remainingSubstr.length)}
        </strong>
        {combinedRestWords.slice(descIdx + remainingSubstr.length)}
      </RestOfWordsContainer>
    );
  }
  return (
    <RestOfWordsContainer isFirstWordHidden={isFirstWordHidden} hasSplit={hasSplit}>
      .{combinedRestWords}
    </RestOfWordsContainer>
  );
};

type ItemTitleProps = {
  item: SearchItem;
  searchSubstring: string;

  isChild?: boolean;
};

const ItemTitle = ({item, searchSubstring, isChild}: ItemTitleProps) => {
  if (!item.title) {
    return null;
  }

  const fullWord = item.title;

  const words = item.kind !== FieldKind.FUNCTION ? fullWord.split('.') : [fullWord];
  const [firstWord, ...restWords] = words;
  const isFirstWordHidden = isChild;

  const combinedRestWords = restWords.length > 0 ? restWords.join('.') : null;

  const hasSingleField = item.type === ItemType.LINK;

  if (searchSubstring) {
    const idx =
      restWords.length === 0
        ? fullWord.toLowerCase().indexOf(searchSubstring.split('.')[0])
        : fullWord.toLowerCase().indexOf(searchSubstring);

    // Below is the logic to make the current query bold inside the result.
    if (idx !== -1) {
      return (
        <SearchItemTitleWrapper hasSingleField={hasSingleField}>
          {!isFirstWordHidden && (
            <FirstWordWrapper>
              {firstWord.slice(0, idx)}
              <strong>{firstWord.slice(idx, idx + searchSubstring.length)}</strong>
              {firstWord.slice(idx + searchSubstring.length)}
            </FirstWordWrapper>
          )}
          {combinedRestWords && (
            <HighlightedRestOfWords
              firstWord={firstWord}
              isFirstWordHidden={isFirstWordHidden}
              searchSubstring={searchSubstring}
              combinedRestWords={combinedRestWords}
              hasSplit={words.length > 1}
            />
          )}
        </SearchItemTitleWrapper>
      );
    }
  }

  return (
    <SearchItemTitleWrapper>
      {!isFirstWordHidden && <FirstWordWrapper>{firstWord}</FirstWordWrapper>}
      {combinedRestWords && (
        <RestOfWordsContainer
          isFirstWordHidden={isFirstWordHidden}
          hasSplit={words.length > 1}
        >
          .{combinedRestWords}
        </RestOfWordsContainer>
      )}
    </SearchItemTitleWrapper>
  );
};

type KindTagProps = {kind: FieldKind; deprecated?: boolean};

const KindTag = ({kind, deprecated}: KindTagProps) => {
  let text, tagType;
  switch (kind) {
    case FieldKind.FUNCTION:
      text = 'f(x)';
      tagType = 'success';
      break;
    case FieldKind.MEASUREMENT:
      text = 'field';
      tagType = 'highlight';
      break;
    case FieldKind.BREAKDOWN:
      text = 'field';
      tagType = 'highlight';
      break;
    case FieldKind.TAG:
      text = kind;
      tagType = 'warning';
      break;
    case FieldKind.NUMERIC_METRICS:
      text = 'f(x)';
      tagType = 'success';
      break;
    case FieldKind.FIELD:
    default:
      text = kind;
  }

  if (deprecated) {
    text = 'deprecated';
    tagType = 'error';
  }

  return <Tag type={tagType}>{text}</Tag>;
};

type DropdownItemProps = {
  item: SearchItem;
  onClick: (value: string, item: SearchItem) => void;
  searchSubstring: string;
  isChild?: boolean;
  onIconClick?: any;
};

const DropdownItem = ({
  item,
  isChild,
  searchSubstring,
  onClick,
  onIconClick,
}: DropdownItemProps) => {
  const isDisabled = item.value === null;

  let children: React.ReactNode;
  if (item.type === ItemType.RECENT_SEARCH) {
    children = <QueryItem item={item} />;
  } else if (item.type === ItemType.INVALID_TAG) {
    children = (
      <Invalid>
        {tct("The field [field] isn't supported here. ", {
          field: <strong>{item.desc}</strong>,
        })}
        {tct('[highlight:See all searchable properties in the docs.]', {
          highlight: <Highlight />,
        })}
      </Invalid>
    );
  } else if (item.type === ItemType.LINK) {
    children = (
      <Fragment>
        <ItemTitle item={item} isChild={isChild} searchSubstring={searchSubstring} />
        {onIconClick && (
          <IconOpen
            onClick={e => {
              // stop propagation so the item-level onClick doesn't get called
              e.stopPropagation();
              onIconClick(item.value);
            }}
          />
        )}
      </Fragment>
    );
  } else {
    children = (
      <Fragment>
        <ItemTitle item={item} isChild={isChild} searchSubstring={searchSubstring} />
        {item.desc && <Value hasDocs={!!item.documentation}>{item.desc}</Value>}
        <DropdownDocumentation
          documentation={item.documentation}
          searchSubstring={searchSubstring}
        />
        <TagWrapper>
          {item.kind && !isChild && (
            <KindTag kind={item.kind} deprecated={item.deprecated} />
          )}
        </TagWrapper>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <SearchListItem
        className={`${isChild ? 'group-child' : ''} ${item.active ? 'active' : ''}`}
        data-test-id="search-autocomplete-item"
        onClick={
          !isDisabled ? item.callback ?? onClick.bind(this, item.value, item) : undefined
        }
        ref={element => item.active && element?.scrollIntoView?.({block: 'nearest'})}
        isGrouped={isChild}
        isDisabled={isDisabled}
      >
        {children}
      </SearchListItem>
      {!isChild &&
        item.children?.map(child => (
          <DropdownItem
            key={getDropdownItemKey(child)}
            item={child}
            onClick={onClick}
            searchSubstring={searchSubstring}
            isChild
          />
        ))}
    </Fragment>
  );
};

type DropdownDocumentationProps = {
  searchSubstring: string;
  documentation?: React.ReactNode;
};

const DropdownDocumentation = ({
  documentation,
  searchSubstring,
}: DropdownDocumentationProps) => {
  if (documentation && typeof documentation === 'string') {
    const startIndex =
      documentation.toLocaleLowerCase().indexOf(searchSubstring.toLocaleLowerCase()) ??
      -1;
    if (startIndex !== -1) {
      const endIndex = startIndex + searchSubstring.length;

      return (
        <Documentation>
          {documentation.slice(0, startIndex)}
          <strong>{documentation.slice(startIndex, endIndex)}</strong>
          {documentation.slice(endIndex)}
        </Documentation>
      );
    }
  }

  return <Documentation>{documentation}</Documentation>;
};

type QueryItemProps = {item: SearchItem};

const QueryItem = ({item}: QueryItemProps) => {
  if (!item.value) {
    return null;
  }

  const parsedQuery = parseSearch(item.value);

  if (!parsedQuery) {
    return null;
  }

  return (
    <QueryItemWrapper>
      <HighlightQuery parsedQuery={parsedQuery} />
    </QueryItemWrapper>
  );
};

const LoadingWrapper = styled('div')`
  display: flex;
  justify-content: center;
  padding: ${space(1)};
`;

const Info = styled('div')`
  display: flex;
  padding: ${space(1)} ${space(2)};
  font-size: ${p => p.theme.fontSizeLarge};
  color: ${p => p.theme.gray300};

  &:not(:last-child) {
    border-bottom: 1px solid ${p => p.theme.innerBorder};
  }
`;

const ListItem = styled('li')`
  &:not(:first-child):not(.group-child) {
    border-top: 1px solid ${p => p.theme.innerBorder};
  }
`;

const SearchDropdownGroup = styled(ListItem)``;

const SearchDropdownGroupTitle = styled('header')`
  display: flex;
  align-items: center;

  background-color: ${p => p.theme.backgroundSecondary};
  color: ${p => p.theme.gray300};
  font-weight: normal;
  font-size: ${p => p.theme.fontSizeMedium};

  margin: 0;
  padding: ${space(1)} ${space(2)};

  & > svg {
    margin-right: ${space(1)};
  }
`;

const SearchItemsList = styled('ul')<{maxMenuHeight?: number}>`
  padding-left: 0;
  list-style: none;
  margin-bottom: 0;
  ${p => {
    if (p.maxMenuHeight !== undefined) {
      return `
        max-height: ${p.maxMenuHeight}px;
        overflow-y: scroll;
      `;
    }

    return `
      height: auto;
    `;
  }}
`;

const SearchListItem = styled(ListItem)<{isDisabled?: boolean; isGrouped?: boolean}>`
  scroll-margin: 40px 0;
  font-size: ${p => p.theme.fontSizeLarge};
  padding: 4px ${space(2)};

  min-height: ${p => (p.isGrouped ? '30px' : '36px')};

  ${p => {
    if (!p.isDisabled) {
      return `
        cursor: pointer;

        &:hover,
        &.active {
          background: ${p.theme.hover};
        }
      `;
    }

    return '';
  }}

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const SearchItemTitleWrapper = styled('div')<{hasSingleField?: boolean}>`
  display: flex;
  flex-grow: 1;
  flex-shrink: 0;
  max-width: ${p => (p.hasSingleField ? '75%' : 'min(280px, 50%)')};

  color: ${p => p.theme.textColor};
  font-weight: normal;
  font-size: ${p => p.theme.fontSizeMedium};
  margin: 0;
  line-height: ${p => p.theme.text.lineHeightHeading};

  ${p => p.theme.overflowEllipsis};
`;

const RestOfWordsContainer = styled('span')<{
  hasSplit?: boolean;
  isFirstWordHidden?: boolean;
}>`
  color: ${p => (p.hasSplit ? p.theme.blue400 : p.theme.textColor)};
  margin-left: ${p => (p.isFirstWordHidden ? space(1) : '0px')};
`;

const FirstWordWrapper = styled('span')`
  font-weight: medium;
`;

const TagWrapper = styled('span')`
  width: 5%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const Documentation = styled('span')`
  font-size: ${p => p.theme.fontSizeMedium};
  font-family: ${p => p.theme.text.family};
  color: ${p => p.theme.gray300};
  display: flex;
  flex: 2;
  padding: 0 ${space(1)};

  white-space: pre;

  @media (max-width: ${p => p.theme.breakpoints.small}) {
    display: none;
  }
`;

const DropdownFooter = styled(`div`)`
  width: 100%;
  min-height: 45px;
  background-color: ${p => p.theme.backgroundSecondary};
  border-top: 1px solid ${p => p.theme.innerBorder};
  flex-direction: row;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${space(1)};
  flex-wrap: wrap;
  gap: ${space(1)};
`;

const ShortcutsRow = styled('div')`
  flex-direction: row;
  display: flex;
  align-items: center;
`;

const ShortcutButtonContainer = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: auto;
  padding: 0 ${space(1.5)};

  cursor: pointer;

  :hover {
    border-radius: ${p => p.theme.borderRadius};
    background-color: ${p => color(p.theme.hover).darken(0.02).string()};
  }
`;

const HotkeyGlyphWrapper = styled('span')`
  color: ${p => p.theme.gray300};
  margin-right: ${space(0.5)};

  @media (max-width: ${p => p.theme.breakpoints.small}) {
    display: none;
  }
`;

const IconWrapper = styled('span')`
  display: none;

  @media (max-width: ${p => p.theme.breakpoints.small}) {
    display: flex;
    margin-right: ${space(0.5)};
    align-items: center;
    justify-content: center;
  }
`;

const HotkeyTitle = styled(`span`)`
  font-size: ${p => p.theme.fontSizeSmall};
`;

const Invalid = styled(`span`)`
  font-size: ${p => p.theme.fontSizeSmall};
  font-family: ${p => p.theme.text.family};
  color: ${p => p.theme.gray400};
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  span {
    white-space: pre;
  }
`;

const Highlight = styled(`strong`)`
  color: ${p => p.theme.linkColor};
`;

const QueryItemWrapper = styled('span')`
  font-size: ${p => p.theme.fontSizeSmall};
  width: 100%;
  gap: ${space(1)};
  display: flex;
  white-space: nowrap;
  word-break: normal;
  font-family: ${p => p.theme.text.familyMono};
`;

const Value = styled('span')<{hasDocs?: boolean}>`
  font-family: ${p => p.theme.text.familyMono};
  font-size: ${p => p.theme.fontSizeSmall};

  max-width: ${p => (p.hasDocs ? '280px' : 'none')};

  ${p => p.theme.overflowEllipsis};
`;
