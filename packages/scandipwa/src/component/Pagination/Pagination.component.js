/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/scandipwa
 * @link https://github.com/scandipwa/scandipwa
 */

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import ChevronIcon from 'Component/ChevronIcon';
import { LEFT, RIGHT } from 'Component/ChevronIcon/ChevronIcon.config';
import PaginationLink from 'Component/PaginationLink';
import TextPlaceholder from 'Component/TextPlaceholder';
import { MixType } from 'Type/Common.type';
import { range } from 'Util/Manipulations';

import './Pagination.style';

/** @namespace Component/Pagination/Component */
export class Pagination extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        pathname: PropTypes.string.isRequired,
        totalPages: PropTypes.number.isRequired,
        currentPage: PropTypes.number.isRequired,
        getSearchQuery: PropTypes.func.isRequired,
        anchorTextPrevious: PropTypes.string.isRequired,
        anchorTextNext: PropTypes.string.isRequired,
        firstFramePage: PropTypes.number.isRequired,
        lastFramePage: PropTypes.number.isRequired,
        prevPageJump: PropTypes.number.isRequired,
        nextPageJump: PropTypes.number.isRequired,
        shouldRenderNextJump: PropTypes.bool.isRequired,
        shouldRenderPreviousJump: PropTypes.bool.isRequired,
        shouldRenderJumps: PropTypes.bool.isRequired,
        paginationFrame: PropTypes.number.isRequired,
        id: PropTypes.string.isRequired,
        mix: MixType.isRequired
    };

    renderPreviousPageLink() {
        const {
            anchorTextPrevious,
            currentPage,
            totalPages,
            paginationFrame
        } = this.props;

        /*
        1. hide 'Previous' button if current page is the first page
        2. hide 'Previous' button if total number of pages doesn't exceed total number of pages to display
        (i.e. all pages are already shown)
         */
        if (currentPage <= 1 || paginationFrame >= totalPages) {
            return (
                <li block="Pagination" elem="ListItem" />
            );
        }

        return this.renderPageLink(
            currentPage - 1,
            __('Previous page'),
            anchorTextPrevious || this.renderPageIcon()
        );
    }

    renderPageLinks() {
        const {
            currentPage,
            firstFramePage,
            lastFramePage
        } = this.props;

        return range(firstFramePage, lastFramePage).map((page) => this.renderPageLink(
            page,
            __('Page %s', page),
            page.toString(),
            page === currentPage
        ));
    }

    renderPageIcon(isNext = false) {
        return (
            <ChevronIcon direction={ isNext ? RIGHT : LEFT } />
        );
    }

    renderNextPageLink() {
        const {
            anchorTextNext,
            currentPage,
            totalPages,
            paginationFrame
        } = this.props;

        /*
        1. hide 'Next' button if current page is the last page
        2. hide 'Next' button if total number of pages doesn't exceed total number of pages to display
        (i.e. all pages are already shown)
         */
        if (currentPage > totalPages - 1 || paginationFrame >= totalPages) {
            return (
                <li block="Pagination" elem="ListItem" />
            );
        }

        return this.renderPageLink(
            currentPage + 1,
            __('Next page'),
            anchorTextNext || this.renderPageIcon(true)
        );
    }

    renderPageLink(
        pageNumber,
        label,
        children,
        isCurrent = false
    ) {
        const {
            pathname,
            getSearchQuery
        } = this.props;

        return (
            <li
              key={ pageNumber }
              block="Pagination"
              elem="ListItem"
            >
                <PaginationLink
                  label={ label }
                  url_path={ pathname }
                  isCurrent={ isCurrent }
                  pageNumber={ pageNumber }
                  getSearchQueryForPage={ getSearchQuery }
                >
                    { children }
                </PaginationLink>
            </li>
        );
    }

    renderFirstPageLink() {
        const { shouldRenderJumps, firstFramePage } = this.props;

        if (!shouldRenderJumps || firstFramePage === 1) {
            return null;
        }

        return this.renderPageLink(
            1,
            __('Page %s', 1),
            '1',
        );
    }

    renderLastPageLink() {
        const { totalPages, shouldRenderJumps, lastFramePage } = this.props;

        if (!shouldRenderJumps || lastFramePage === totalPages) {
            return null;
        }

        return this.renderPageLink(
            totalPages,
            __('Page %s', totalPages),
            totalPages.toString(),
        );
    }

    // displayed as '...' by default
    renderPreviousJump() {
        const { prevPageJump, shouldRenderPreviousJump } = this.props;

        if (!shouldRenderPreviousJump) {
            return null;
        }

        return this.renderPageLink(
            prevPageJump,
            __('Page %s', prevPageJump),
            '...',
        );
    }

    // displayed as '...' by default
    renderNextJump() {
        const { nextPageJump, shouldRenderNextJump } = this.props;

        if (!shouldRenderNextJump) {
            return null;
        }

        return this.renderPageLink(
            nextPageJump,
            __('Page %s', nextPageJump),
            '...',
        );
    }

    renderPlaceholder() {
        return (
            <ul block="Pagination" mods={ { isLoading: true } }>
                { Array.from({ length: 4 }, (_, i) => (
                    <li
                      key={ i }
                      block="Pagination"
                      elem="ListItem"
                    >
                        <TextPlaceholder length="block" />
                    </li>
                )) }
            </ul>
        );
    }

    render() {
        const {
            isLoading,
            totalPages,
            id,
            mix
        } = this.props;

        if (totalPages === 1) { // do not show pagination, if there are less then one page
            return <ul block="Pagination" />;
        }

        if (isLoading) {
            return this.renderPlaceholder();
        }

        return (
            <nav aria-label={ __('List navigation') }>
                <ul block="Pagination" id={ id } mix={ mix }>
                    { this.renderPreviousPageLink() }
                    { this.renderFirstPageLink() }
                    { this.renderPreviousJump() }
                    { this.renderPageLinks() }
                    { this.renderNextJump() }
                    { this.renderLastPageLink() }
                    { this.renderNextPageLink() }
                </ul>
            </nav>
        );
    }
}

export default Pagination;
