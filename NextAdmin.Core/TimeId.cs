namespace NextAdmin.Core
{
    public class TimeId
    {

        private static Object _lock = new Object();

        private static long? _lastTick = null;

        private static long _lastTickIncrement = 0;

        public static string NewTimeId()
        {
            lock (_lock)
            {
                var tick = DateTime.Now.Ticks;
                if (_lastTick == tick)
                {
                    _lastTickIncrement++;
                }
                else
                {
                    _lastTickIncrement = 0;
                }
                _lastTick = tick;
                return tick.ToString() + "-" + _lastTickIncrement.ToString().PadLeft(8, '0');
            }
        }

    }
}
