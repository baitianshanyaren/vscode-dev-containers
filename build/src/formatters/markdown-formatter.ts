/*--------------------------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See https://go.microsoft.com/fwlink/?linkid=2090316 for license information.
 *-------------------------------------------------------------------------------------------------------------*/

import { DistroInfo, ImageInfo, PackageInfo, Component, Formatter } from "../domain/common";

/* 
Returns: 

{
    name: "Xdebug",
    version: "2.9.6",
    url: "https://pecl.php.net/get/xdebug-2.9.6.tgz"
    path: "/opt/something"
}

*/
function nameAndVersionNormalizer(packageInfo: PackageInfo): PackageInfo {
    if (packageInfo.markdownIgnore) {
        return null;
    }
    const normalized = Object.assign({}, packageInfo);
    normalized.version = packageInfo.version || packageInfo.commitHash;  
    if(!normalized.version) {
        console.log(`(!) Warning: No version for package ${packageInfo.name} - skipping markdown output.`);
        return null;
    }
    normalized.version = normalized.version.replace(/\n/g,'<br />');
    normalized.path = normalized.path ? normalized.path.replace(/\n/g,'<br />') : normalized.path;
    return normalized;
}

/* Handle CG manifest entries like:
{
    "Component": {
        "Type": "other",
        "Other": {
            "Name": "Xdebug",
            "Version": "2.9.6",
            "DownloadUrl": "https://pecl.php.net/get/xdebug-2.9.6.tgz"
        }
    }
}

Returns: 

{
    name: "Xdebug",
    version: "2.9.6",
    "url": "https://pecl.php.net/get/xdebug-2.9.6.tgz"
}

*/
function componentNormalizer(component: Component): PackageInfo {
    if (component.markdownIgnore) {
        return null;
    }
    let componentType = component.Component.Type;
    // Handle capitalization differences
    if (!component.Component[componentType]) {
        componentType = componentType[0].toUpperCase() + componentType.substr(1);
    }
    const componentInfo = component.Component[componentType];
    return {
        name: componentInfo.Name,
        url: componentInfo.DownloadUrl,
        version: componentInfo.Version
    }
}

export class MarkdownFormatter implements Formatter {
    image(info: ImageInfo) {
        return info;
    }
    distro(info: DistroInfo) {
        return info;
    }
    linux = nameAndVersionNormalizer;
    npm = nameAndVersionNormalizer;
    pip = nameAndVersionNormalizer;
    pipx = nameAndVersionNormalizer;
    gem = nameAndVersionNormalizer;
    cargo = nameAndVersionNormalizer;
    go = nameAndVersionNormalizer;
    git = nameAndVersionNormalizer;
    other = nameAndVersionNormalizer;
    languages = nameAndVersionNormalizer;
    manual = componentNormalizer;
}
