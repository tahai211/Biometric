//using Microsoft.EntityFrameworkCore;
//using System;
//using System.Linq;
//using System.Threading;
//using System.Threading.Tasks;
//using CIMP.Domain.Abstractions;

//namespace CIMP.Infrastructure.Extensions
//{
//    public static class QueryablePagedListExtensions
//    {
//        /// <summary>
//        /// Converts the specified source to <see cref="IPagedList{T}"/> by the specified <paramref name="pageIndex"/> and <paramref name="pageSize"/>.
//        /// </summary>
//        /// <typeparam name="T">The type of the source.</typeparam>
//        /// <param name="source">The source to paging.</param>
//        /// <param name="pageIndex">The index of the page.</param>
//        /// <param name="pageSize">The size of the page.</param>
//        /// <param name="rowModify"></param>
//        /// <param name="cancellationToken">
//        ///     A <see cref="CancellationToken" /> to observe while waiting for the task to complete.
//        /// </param>
//        /// <returns>An instance of the inherited from <see cref="IPagedList{T}"/> interface.</returns>
//        public static async Task<IPagedList<T>> ToPagedListAsync<T>(this IQueryable<T> source, int pageIndex, int pageSize, int rowModify, CancellationToken cancellationToken = default(CancellationToken))
//        {
//            var count = await source.CountAsync(cancellationToken).ConfigureAwait(false);
//            var items = await source.Skip(((pageIndex - 1) * pageSize) + rowModify)
//                                    .Take(pageSize).ToListAsync(cancellationToken).ConfigureAwait(false);

//            var pagedList = new PagedList<T>()
//            {
//                PageNumber = pageIndex,
//                PageSize = pageSize,
//                RowModify = rowModify,
//                TotalItems = count,
//                Items = items,
//                TotalPages = (int)Math.Ceiling(count / (double)pageSize)
//            };

//            return pagedList;
//        }
//    }
//}
