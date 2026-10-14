-- Ellimore Loader
-- For scripts you own / are authorized to distribute.
local script_key = "YOUR_KEY"
local base_url = "https://ellimore-loader-production.up.railway.app/loader.lua"

local url = base_url .. "?key=" .. game:GetService("HttpService"):UrlEncode(script_key)

local ok, response = pcall(function()
    return game:HttpGet(url)
end)

if not ok then
    error("Ellimore loader request failed.")
end

if not response or response == "" then
    error("Ellimore returned an empty response.")
end

local fn, compileError = loadstring(response)
if not fn then
    error("Ellimore script could not be loaded: " .. tostring(compileError))
end

return fn()
