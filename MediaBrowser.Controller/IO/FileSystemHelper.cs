﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediaBrowser.Controller.Resolvers;
using MediaBrowser.Controller.Library;

namespace MediaBrowser.Controller.IO
{
    public static class FileSystemHelper
    {
        /// <summary>
        /// Transforms shortcuts into their actual paths and filters out items that should be ignored
        /// </summary>
        public static ItemResolveEventArgs FilterChildFileSystemEntries(ItemResolveEventArgs args, bool flattenShortcuts)
        {
            
            List<WIN32_FIND_DATA> returnChildren = new List<WIN32_FIND_DATA>();
            List<WIN32_FIND_DATA> resolvedShortcuts = new List<WIN32_FIND_DATA>();

            foreach (var file in args.FileSystemChildren)
            {
                // If it's a shortcut, resolve it
                if (Shortcut.IsShortcut(file.Path))
                {
                    string newPath = Shortcut.ResolveShortcut(file.Path);
                    WIN32_FIND_DATA newPathData = FileData.GetFileData(newPath);

                    // Find out if the shortcut is pointing to a directory or file
                    if (newPathData.IsDirectory)
                    {
                        // add to our physical locations
                        args.AdditionalLocations.Add(newPath);

                        // If we're flattening then get the shortcut's children
                        if (flattenShortcuts)
                        {
                            returnChildren.Add(file);
                            ItemResolveEventArgs newArgs = new ItemResolveEventArgs()
                            {
                                FileSystemChildren = FileData.GetFileSystemEntries(newPath, "*").ToArray()
                            };

                            resolvedShortcuts.AddRange(FilterChildFileSystemEntries(newArgs, false).FileSystemChildren);
                        }
                        else
                        {
                            returnChildren.Add(newPathData);
                        }
                    }
                    else
                    {
                        returnChildren.Add(newPathData);
                    }
                }
                else
                {
                    //not a shortcut check to see if we should filter it out
                    if (EntityResolutionHelper.ShouldResolvePath(file))
                    {
                        returnChildren.Add(file);
                    }
                    else
                    {
                        //filtered - see if it is one of our "indicator" folders and mark it now - no reason to search for it again
                        args.IsBDFolder |= file.cFileName.Equals("bdmv", StringComparison.OrdinalIgnoreCase);
                        args.IsDVDFolder |= file.cFileName.Equals("video_ts", StringComparison.OrdinalIgnoreCase);
                        args.IsHDDVDFolder |= file.cFileName.Equals("hvdvd_ts", StringComparison.OrdinalIgnoreCase);
                    }
                }
            }

            if (resolvedShortcuts.Count > 0)
            {
                resolvedShortcuts.InsertRange(0, returnChildren);
                args.FileSystemChildren = resolvedShortcuts.ToArray();
            }
            else
            {
                args.FileSystemChildren = returnChildren.ToArray();
            }
            return args;
        }

    }
}
