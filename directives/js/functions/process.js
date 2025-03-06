directives.FunctionCreate('process', function(trigger, context, compile, node, identifier)
{
    let items = this.addon.GetTemp('sorted');

    if(!items)
    {
        items = directives.SetTemp('sorted', Object.values(directives.ItemsGet()).sort((a, b) => (a.Get('order')) - (b.Get('order'))));
    }

    for (let i = 0; i < items.length; i++)
    {
        const directive = items[i];

        if(directive.Get('trigger') !== trigger)
        {
            continue;
        }

        const matches = {};

        const match = directive.Get('match');
        if (match)
        {
            if (match.text && !matchText(match.text, node, matches))
            {
                continue;
            }

            if (match.attribute && !matchAttribute(match.attribute, node, matches))
            {
                continue;
            }

            if (match.tag && !matchTag(match.tag, node, matches))
            {
                continue;
            }

            if (match.type && !matchNodeType(match.type, node, matches))
            {
                continue;
            }

            if (match.parent && !matchParent(match.parent, node, matches))
            {
                continue;
            }

            if (match.child && !matchChild(match.child, node, matches))
            {
                continue;
            }

            if (match.content && !matchContent(match.content, node, matches))
            {
                continue;
            }

            if (match.empty !== undefined && !matchEmpty(match.empty, node, matches))
            {
                continue;
            }
        }

        try
        {
            directive.Get('code').call({}, context, compile, node, identifier, matches);
        }
        catch (error)
        {
            errors.Fire(error.message, 'warn');
        }
    }

    function createRegex(pattern, defaultFlags)
    {
        if (typeof pattern !== 'string')
        {
            return null;
        }

        if (pattern.startsWith('/') && pattern.lastIndexOf('/') > 0)
        {
            const lastSlashIndex = pattern.lastIndexOf('/');
            const regexPattern = pattern.substring(1, lastSlashIndex);
            const flags = pattern.substring(lastSlashIndex + 1) || defaultFlags || '';

            try
            {
                return new RegExp(regexPattern, flags);
            }
            catch (e)
            {
                errors.Fire('Invalid regex pattern: ' + pattern, 'warn');
                return null;
            }
        }

        try
        {
            return new RegExp(pattern, defaultFlags || '');
        }
        catch (e)
        {
            errors.Fire('Invalid regex pattern: ' + pattern, 'warn');
            return null;
        }
    }

    function matchText(pattern, node, matches)
    {
        if (node.nodeType !== Node.TEXT_NODE)
        {
            return false;
        }

        const regex = createRegex(pattern, 'g');
        if (!regex)
        {
            return false;
        }

        const nodeText = node.textContent;
        const allMatches = [...nodeText.matchAll(regex)];

        if (allMatches.length > 0)
        {
            matches.text = allMatches;
            return true;
        }

        return false;
    }

    function matchAttribute(pattern, node, matches)
    {
        if (node.nodeType !== Node.ELEMENT_NODE)
        {
            return false;
        }

        if (typeof pattern === 'object' && pattern !== null)
        {
            const attributeName = pattern.name;
            const attributeValue = pattern.value;

            if (!attributeName)
            {
                return false;
            }

            const nameRegex = createRegex(attributeName);

            if (!nameRegex)
            {
                return false;
            }

            let hasMatches = false;

            if (!matches.attribute)
            {
                matches.attribute = {};
            }

            for (let j = 0; j < node.attributes.length; j++)
            {
                const attrName = node.attributes[j].name;
                const nameMatch = attrName.match(nameRegex);

                if (nameMatch)
                {
                    if (attributeValue)
                    {
                        const attrValue = node.attributes[j].value;
                        const valueRegex = createRegex(attributeValue);

                        if (!valueRegex)
                        {
                            continue;
                        }

                        const valueMatch = attrValue.match(valueRegex);

                        if (!valueMatch)
                        {
                            continue;
                        }

                        matches.attribute[attrName] = {
                            name: attrName,
                            value: attrValue,
                            index: j
                        };

                        hasMatches = true;
                    }
                    else
                    {
                        matches.attribute[attrName] = {
                            name: attrName,
                            value: node.attributes[j].value,
                            index: j
                        };

                        hasMatches = true;
                    }
                }
            }

            return hasMatches;
        }

        return false;
    }

    function matchTag(pattern, node, matches)
    {
        if (node.nodeType !== Node.ELEMENT_NODE)
        {
            return false;
        }

        const regex = createRegex(pattern, 'i');
        if (!regex)
        {
            return false;
        }

        const tagName = node.tagName.toLowerCase();
        const match = tagName.match(regex);

        if (match)
        {
            matches.tag = {
                name: tagName,
                match: match
            };
            return true;
        }

        return false;
    }

    function matchNodeType(pattern, node, matches)
    {
        const nodeType = node.nodeType;
        const regex = createRegex(pattern);

        if (!regex)
        {
            return false;
        }

        const match = String(nodeType).match(regex);

        if (match)
        {
            matches.type = {
                value: nodeType,
                match: match
            };
            return true;
        }

        return false;
    }

    function matchParent(pattern, node, matches)
    {
        if (!node.parentNode)
        {
            return false;
        }

        if (node.parentNode.nodeType === Node.ELEMENT_NODE)
        {
            const regex = createRegex(pattern, 'i');
            if (!regex)
            {
                return false;
            }

            const parentTag = node.parentNode.tagName.toLowerCase();
            const match = parentTag.match(regex);

            if (match)
            {
                matches.parent = {
                    name: parentTag,
                    match: match,
                    element: node.parentNode
                };
                return true;
            }
        }

        return false;
    }

    function matchContent(pattern, node, matches)
    {
        const content = node.textContent;

        const regex = createRegex(pattern);
        if (!regex)
        {
            return false;
        }

        const match = content.match(regex);

        if (match)
        {
            matches.content = {
                text: content,
                match: match
            };
            return true;
        }

        return false;
    }

    function matchEmpty(pattern, node, matches)
    {
        if (node.nodeType !== Node.ELEMENT_NODE)
        {
            return false;
        }

        const isEmpty = node.children.length === 0 && (!node.textContent || node.textContent.trim() === '');

        if (pattern === true && isEmpty)
        {
            matches.empty = true;
            return true;
        }

        if (pattern === false && !isEmpty)
        {
            matches.empty = false;
            return true;
        }

        return false;
    }

    function matchChild(pattern, node, matches)
    {
        if (node.nodeType !== Node.ELEMENT_NODE)
        {
            return false;
        }

        const regex = createRegex(pattern, 'i');
        if (!regex)
        {
            return false;
        }

        // Look for direct children that match the pattern
        for (let i = 0; i < node.children.length; i++)
        {
            const childTag = node.children[i].tagName.toLowerCase();
            const match = childTag.match(regex);

            if (match)
            {
                matches.child = {
                    name: childTag,
                    match: match,
                    element: node.children[i],
                    index: i
                };
                return true;
            }
        }

        return false;
    }
});