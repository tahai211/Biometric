//using CIMP.Domain.Abstractions;
//using System.Collections.Generic;

//namespace CIMP.Infrastructure.Extensions
//{
//    public static class EnumerablePagedListExtensions
//    {
//        /// <summary>
//        /// Converts the specified source to <see cref="IPagedList{T}"/> by the specified <paramref name="pageIndex"/> and <paramref name="pageSize"/>.
//        /// </summary>
//        /// <typeparam name="T">The type of the source.</typeparam>
//        /// <param name="source">The source to paging.</param>
//        /// <param name="pageIndex">The index of the page.</param>
//        /// <param name="pageSize">The size of the page.</param>
//        /// <param name="rowModify"></param>
//        /// <returns>An instance of the inherited from <see cref="IPagedList{T}"/> interface.</returns>
//        public static IPagedList<T> ToPagedList<T>(this IEnumerable<T> source, int pageIndex, int pageSize, int rowModify = 0, bool isGetAll = false) => new PagedList<T>(source, pageIndex, pageSize, rowModify, isGetAll);
//    }
//}
