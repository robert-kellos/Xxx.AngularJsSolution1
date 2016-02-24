using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Routing;
using System.Linq.Dynamic;

namespace Xxx.AngularJsSolution1.WebApi.Controllers
{

    public class BaseApiController : ApiController
    {
        #region Protected Methods
        /// <summary>
        /// Appends the pagination data to the response header.
        /// Specify route name to add next and previous links to the pagination header.
        /// </summary>
        /// <param name="query">The query.</param>
        /// <param name="page">The page.</param>
        /// <param name="pageSize">Size of the page.</param>
        /// <param name="routeName">Name of the route.</param>
        protected void AppendPaginationDataToHeader<T>(IQueryable<T> query, int page, int pageSize, string routeName = null)
        {
            if (page <1 || pageSize < 1 || query==null || !query.Any())
                return;

            var totalCount = query.Count();
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);
            dynamic paginationHeader;

            var prevLink = string.Empty;
            var nextLink = string.Empty;

            if (string.IsNullOrEmpty(routeName))
            {
                paginationHeader = new
                {
                    TotalCount = totalCount,
                    TotalPages = totalPages,
                    CurrentPage = page
                };
            }
            else
            {
                var urlHelper = new UrlHelper(Request);
                prevLink = page > 0 ? urlHelper.Link(routeName, new { page = page - 1, pageSize = pageSize }) : "";
                nextLink = page < totalPages - 1 ? urlHelper.Link(routeName, new { page = page + 1, pageSize = pageSize }) : "";

                paginationHeader = new
                {
                    TotalCount = totalCount,
                    TotalPages = totalPages,
                    CurrentPage = page,
                    PrevPageLink = prevLink,
                    NextPageLink = nextLink
                };
            }

            HttpContext.Current.Response.Headers.Add(string.Format("{0}-data-pagination", "app"),
            Newtonsoft.Json.JsonConvert.SerializeObject(paginationHeader, Newtonsoft.Json.Formatting.None));
        }

        /// <summary>
        /// Selects the target page.
        /// </summary>
        /// <param name="query">The query.</param>
        /// <param name="page">The page.</param>
        /// <param name="pageSize">Size of the page.</param>
        /// <returns></returns>
        protected List<T> GetRequestedPage<T>(IQueryable<T> query, int page, int pageSize)
        {
            return query
                .ToList()
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();
        }

        /// <summary>
        /// Gets the requested page.
        /// </summary>
        /// <param name="query">The query.</param>
        /// <param name="page">The page.</param>
        /// <param name="pageSize">Size of the page.</param>
        /// <param name="sortBy">The sort by.</param>
        /// <param name="reverse">if set to <c>true</c> [reverse].</param>
        /// <returns></returns>
        protected List<T> GetRequestedPage<T>(IQueryable<T> query, int page, int pageSize, string sortBy, bool reverse)
        {
            //Requires System.Linq.Dynamic Nuget Package and "using System.Linq.Dynamic;"
            query = query.OrderBy(sortBy + (reverse ? " descending" : "")).AsQueryable();
            return GetRequestedPage(query, page, pageSize);
        }
        #endregion
    }


}