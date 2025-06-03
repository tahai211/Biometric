using System.Reflection;
//using Serilog;

namespace Biometrics.ApiService.Infra.Common
{
    public class WorkflowUtility
    {
        ////Simple: call Execute on the function editor to test
        //public static object Execute()
        //{
        //    //return YourSharedUtilityMethodName();
        //    return null;
        //}
        //public static object GetActivityDataByPath(string dataPath, ActivityExecutionContext context)
        //{
        //    string[] dataPaths = dataPath.Split('.');
        //    if (dataPaths.Length < 2)
        //        throw new IdpException("sys_error", $"Data path {dataPath} is invalid");

        //    var activityId = context.WorkflowExecutionContext.GetActivityBlueprintByName(dataPaths[0]).Id;
        //    var activityOutput = (dynamic)context.WorkflowInstance.ActivityData[activityId][dataPaths[1]];
        //    object subObject = activityOutput;
        //    for (int i = 2; i < dataPaths.Length; i++)
        //    {
        //        subObject = GetSubObject(dataPaths[i], subObject);
        //    }
        //    return subObject;
        //}
        //public static object GetSubObject(string pName, object subObject)
        //{
        //    PropertyInfo pi = subObject.GetType().GetProperty(pName);
        //    if (pi != null && !pi.Equals(null))
        //    {
        //        return pi.GetValue(subObject, null);
        //    }
        //    else if (((IDictionary<String, Object>)subObject).ContainsKey(pName))
        //    {
        //        return ((IDictionary<String, Object>)subObject)[pName];
        //    }
        //    else
        //    {
        //        throw new IdpException("sys_error", $"Property {pName} was not found");
        //    }
        //}
        //public static bool SetActivityDataByPath(string dataPath, object value, ActivityExecutionContext context)
        //{
        //    string[] dataPaths = dataPath.Split('.');
        //    if (dataPaths.Length < 2)
        //        throw new IdpException("sys_error", $"Data path {dataPath} is invalid");

        //    var activityId = context.WorkflowExecutionContext.GetActivityBlueprintByName(dataPaths[0]).Id;
        //    var activityOutput = (dynamic)context.WorkflowInstance.ActivityData[activityId][dataPaths[1]];
        //    object subObject = activityOutput;

        //    for (int i = 2; i < dataPaths.Length - 1; i++)
        //    {
        //        subObject = GetSubObject(dataPaths[i], subObject);
        //    }
        //    PropertyInfo propertyToSet = subObject?.GetType().GetProperty(dataPaths.Last());
        //    if (propertyToSet != null)
        //    {
        //        var targetType = IsNullableType(propertyToSet.PropertyType) ? Nullable.GetUnderlyingType(propertyToSet.PropertyType) : propertyToSet.PropertyType;
        //        value = Convert.ChangeType(value, targetType);
        //        try
        //        {
        //            value = Convert.ChangeType(value, targetType);
        //        }
        //        catch (Exception ex)
        //        {
        //            switch (System.Type.GetTypeCode(targetType))
        //            {
        //                case System.TypeCode.Int16:
        //                    value = Convert.ToInt16(decimal.Parse(value.ToString()));
        //                    break;
        //                case System.TypeCode.Int32:
        //                    value = Convert.ToInt32(decimal.Parse(value.ToString()));
        //                    break;
        //                case System.TypeCode.Int64:
        //                    value = Convert.ToInt64(decimal.Parse(value.ToString()));
        //                    break;
        //                default:
        //                    throw new IdpException("sys_error", $"Unable to convert datatype for data path {dataPath}");
        //            }
        //        }
        //        propertyToSet.SetValue(subObject, value);
        //    }
        //    else
        //    {
        //        try
        //        {
        //            ((IDictionary<String, Object>)subObject)[dataPaths.Last()] = value;
        //        }
        //        catch (Exception ex)
        //        {
        //            Serilog.Log.Error(ex.ToString());
        //            throw new IdpException("sys_error", $"Unable to convert datatype for data path {dataPath}");
        //        }
        //    }
        //    return true;
        //}
        //public static bool IsNullableType(Type type)
        //{
        //    return type.IsGenericType && type.GetGenericTypeDefinition().Equals(typeof(Nullable<>));
        //}
    }
}
