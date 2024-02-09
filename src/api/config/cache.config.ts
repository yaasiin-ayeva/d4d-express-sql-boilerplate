import EnvConfig from "@config/environment.config";

const CacheConfig = {
    stdTTL: EnvConfig.STD_TTL,
    checkperiod: EnvConfig.CHECK_PERIOD,
    maxKeys: EnvConfig.MAX_KEYS
}

export default CacheConfig;