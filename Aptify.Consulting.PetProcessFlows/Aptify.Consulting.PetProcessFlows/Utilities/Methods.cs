using System;

namespace Aptify.Consulting.PetProcessFlows.Utilities
{
    internal static class Methods
    {
        public static string SafeString(object o)
        {
            try
            {
                return Convert.ToString(o);
            }
            catch
            {
                return string.Empty;
            }
        }
        public static bool SafeBool(object o)
        {
            try
            {
                return Convert.ToBoolean(o);
            }
            catch
            {
                return false;
            }
        }
        public static long SafeLong(object o)
        {
            try
            {
                return Convert.ToInt64(o);
            }
            catch
            {
                return 0;
            }
        }
        public static long SafeLongWithDefault(object o, long defaultValue)
        {
            try
            {
                return Convert.ToInt64(o);
            }
            catch
            {
                return defaultValue;
            }
        }
        public static int SafeInt(object o)
        {
            try
            {
                return Convert.ToInt32(o);
            }
            catch
            {
                return 0;
            }
        }
        public static int SafeIntWithDefault(object o, int defaultValue)
        {
            try
            {
                return Convert.ToInt32(o);
            }
            catch
            {
                return defaultValue;
            }
        }
        public static double SafeDouble(object o)
        {
            try
            {
                return Convert.ToDouble(o);
            }
            catch
            {
                return 0;
            }
        }
        public static decimal SafeDecimal(object o)
        {
            try
            {
                return Convert.ToDecimal(o);
            }
            catch
            {
                return 0;
            }
        }
        public static DateTime SafeDateTime(object o)
        {
            try
            {
                return Convert.ToDateTime(o);
            }
            catch
            {
                return default;
            }
        }
    }
}